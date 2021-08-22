from selenium import webdriver
import time
import cv2
import os


def download_gov24(driver_path, name, val):
    dir_path = os.path.join(os.getcwd(), "servers", "python", "images", "-".join(val))
    try:
        os.makedirs(dir_path)
    except FileExistsError:
        pass

    # chromedriver 의 위치를 지정
    # 크롬 버전을 맞춰야함
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(driver_path, options=options)

    # 첫 페이지 로드 후 파라미터 입력 및 다음페이지 이동
    driver.implicitly_wait(2)
    driver.get('https://www.gov.kr/mw/EgovPageLink.do?link=confirm/AA040_confirm_id')
    driver.find_element_by_name('doc_ref_no1').send_keys(val[0])
    driver.find_element_by_name('doc_ref_no2').send_keys(val[1])
    driver.find_element_by_name('doc_ref_no3').send_keys(val[2])
    driver.find_element_by_name('doc_ref_no4').send_keys(val[3])

    driver.find_element_by_xpath('//*[@id="form2"]/p/span[1]/a').click()

    # 두 번째 페이지 로드 후 파라미터 입력 및 다음페이지 이동
    driver.find_element_by_name('doc_ref_key').send_keys(name)

    driver.find_element_by_xpath('//*[@id="form1"]/p/span[1]/a').click()

    # 세 번째 페이지에서 인증서 오픈
    driver.find_element_by_xpath('//*[@id="form1"]/table/tbody/tr/td[3]/span/a').click()

    # 대상 윈도우 변환
    driver.switch_to.window(driver.window_handles[-1])

    # 윈도우 크기 변경 및 최대화
    time.sleep(2.5)
    #driver.implicitly_wait(2)
    driver.set_window_size(700, 1080) #763,
    driver.find_element_by_xpath('//*[@id="pageFit"]/a').click()
    page_cnt = driver.execute_script("return (viewerFrame.contentWindow || viewerFrame.contentDocument).yex.api.getTotalPageCount();")

    for i in range(page_cnt):
        driver.implicitly_wait(2)
        file_name = os.path.join(dir_path, "certification{}.png".format(i + 1))
        driver.save_screenshot(file_name)

        driver.find_element_by_xpath('//*[@id="btnGotoPageNext"]/a').click()
        crop_gov(dir_path, file_name, page_cnt)

    driver.close()


def crop_gov(dir_path, file_path, page_cnt):
    img = cv2.imread(file_path)
    path = file_path.split(os.sep)
    file_name = path[-1].split(".")[0]

    # first crop
    x = 70
    if page_cnt == 1:
        y = 360
    else:
        y = 360
    width = 530
    height = 210

    cropped_img = img[y: y + height, x: x + width]

    # preprocessing
    gray_cropped_img = cv2.cvtColor(cropped_img, cv2.COLOR_RGB2GRAY)
    ret, th1 = cv2.threshold(gray_cropped_img, 216, 255, cv2.THRESH_BINARY)
    file_name = os.path.join(dir_path, "crop_{}.jpg".format(file_name))
    cv2.imwrite(file_name, th1)


