import os
import numpy as np
import cv2
import glob


def check_dir(doc_num_list, source, isVisualMode = False):
    #source: 0 정부24, source: 1 질병관리청
    dir_name = str("-".join(doc_num_list))
    image_dir = os.path.join(os.getcwd(), "servers", "python", "images", dir_name)
    cert_img_format = os.path.join(image_dir, 'crop*.jpg')
    cropped_vaccination_cert_list = glob.glob(cert_img_format)
    
    is_covid_vaccin_list = []
    for certification in cropped_vaccination_cert_list:
        is_covid_vaccin, acc = check_file(certification, source, isVisualMode)
        is_covid_vaccin_list.append(is_covid_vaccin)
    print(any(is_covid_vaccin_list))


def check_file(source_file_path, source, isVisualMode):
    # test할 이미지 경로, 이미지, 이미지의 수
    dir_name = "{}_list_sample".format("nip") if source else "{}_list_sample".format("gov")
    covid_dir_path = os.path.join(os.getcwd(), "servers", "python", "images", dir_name)
    covid_img_format = os.path.join(covid_dir_path, 'covid*.jpg')
    covid_img_path_list = glob.glob(covid_img_format)
    num_check_image = len(covid_img_path_list)

    # test에 사용할 메쏘드 목록, 메쏘드 수, 메쏘드 별 임계값
    check_methods = ['cv2.TM_CCOEFF_NORMED', 'cv2.TM_CCORR_NORMED', 'cv2.TM_SQDIFF_NORMED']
    num_check_method = len(check_methods)
    score_thresh = np.array([0.7, 0.98, 0.93])

    # 점수 & 테스트 결과 : 행의 수 = 테스트 메쏘드 수, 열의 수 = 테스트 이미지 수
    score = np.zeros((num_check_method, num_check_image))
    test_result = np.full_like(score, False, dtype=bool)

    img = cv2.imread(source_file_path, cv2.CV_8U)
    for j, search_img in enumerate(covid_img_path_list):
        template = cv2.imread(os.path.join(covid_dir_path, search_img), cv2.CV_8U)
        for i, method_name in enumerate(check_methods):
            method = eval(method_name)
            # 템플릿 매칭   ---1
            res = cv2.matchTemplate(img, template, method)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
            # 최대, 최소값과 그 좌표 구하기 ---2
            if method in [cv2.TM_SQDIFF, cv2.TM_SQDIFF_NORMED]:
                score[i][j] += 1 - min_val
                top_left = min_loc
                match_val = min_val
            else:
                score[i][j] += max_val
                top_left = max_loc
                match_val = max_val
            if isVisualMode:
                th, tw = template.shape[:2]
                img_draw = img.copy()
                bottom_right = (top_left[0] + tw, top_left[1] + th)
                cv2.rectangle(img_draw, top_left, bottom_right, (0, 0, 255), 5)
                # 매칭 포인트 표시 ---3
                cv2.putText(img_draw, str(match_val), top_left, \
                            cv2.FONT_HERSHEY_PLAIN, 2, (0, 255, 0), 1, cv2.LINE_AA)
                cv2.imshow(method_name, img_draw)
                cv2.waitKey(0)
                cv2.destroyAllWindows()

    for i in range(len(check_methods)):
        test_result[i] = score[i] > score_thresh[i]

    num_pass = np.sum(test_result)
    is_covid_vaccination = (num_pass >= (num_check_method - 1) * num_check_image)

    # score print
    print("{:17}".format(""), end="")
    for img_path in covid_img_path_list:
        print("{:<13}".format(img_path.split(os.sep)[-1].replace("covid","")), end="")
    print()
    for i, sc in enumerate(score):
        print("{:17}".format(check_methods[i].split("TM_")[-1]), end="")
        for j, s in enumerate(sc):
            print("{:<3}{:<10.5}".format(test_result[i][j], s), end="")
        print()
        
    ## method 1개정도 통과 못하는 건 봐줌
    return is_covid_vaccination, num_pass / (num_check_method * num_check_image)