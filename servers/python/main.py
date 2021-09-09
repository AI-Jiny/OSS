from script.gov24 import download_gov24
from script.nip import download_nip
from script.check_covid import check_dir
import sys
# 인풋 방식 변경: argv 사용
# 아웃풋 방식 변경: 성공일 경우 마지막에 print(True)



def excute_validation(driver_path, name, doc_num_list):
    doc_len = len("".join(doc_num_list))
    if doc_len == 17:
        doc_num_list = doc_num_list[:3]
        not_found_error = download_nip(driver_path, name, doc_num_list) # 증명서 이미지 다운로드 후 크롭
        rst = check_dir(doc_num_list, 1, True, False)                  # 크롭된 증명서의 예방접종 여부 확인


    elif doc_len == 16:
        not_found_error = download_gov24(driver_path, name, doc_num_list) # 증명서 이미지 다운로드 후 크롭
        rst = check_dir(doc_num_list, 0, True, False)                    # 크롭된 증명서의 예방접종 여부 확인

    if not_found_error:
        print("NotFoundDocument")
    else:
        print(rst)
if __name__ == "__main__":
    #######################################################
    name = sys.argv[1]
    document_num_list = []
    for ar in sys.argv[2:]:
        document_num_list.append(ar)
    doc_string = "-".join(document_num_list)

    driver_path = './servers/python/chromedriver'
    #######################################################
    excute_validation(driver_path, name, document_num_list)