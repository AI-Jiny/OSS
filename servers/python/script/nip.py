from selenium import webdriver
import selenium
import time
import cv2
import os


def download_nip(driver_path, name, val):
    not_found_error = False
    dir_path = os.path.join(os.getcwd(), "servers", "python", "images", "-".join(val))

    # chromedriver 의 위치를 지정
    # 크롬 버전을 맞춰야함
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(driver_path, options=options)

    try:
        # 첫 페이지 로드 후 파라미터 입력 및 인증서 오픈
        driver.implicitly_wait(3)
        driver.get('https://nip.kdca.go.kr/irgd/civil.do?MnLv1=2&MnLv2=1')
        driver.find_element_by_name('docNum1').send_keys(val[0])
        driver.find_element_by_name('docNum2').send_keys(val[1])
        driver.find_element_by_name('docNum3').send_keys(val[2])

        driver.find_element_by_xpath('//*[@id="docName"]').send_keys(name)
        driver.find_element_by_xpath('//*[@id="btn_ok"]').click()

        # 대상 윈도우 변환
        driver.switch_to.window(driver.window_handles[-1])

        # 윈도우 크기 변경 및 최대화
        driver.set_window_size(700, 1080)
        driver.implicitly_wait(3)

        # 레이어 종료
        driver.refresh()
        driver.find_element_by_xpath('//*[@id="div_print_info"]/div/div[3]/a/button').click()
        time.sleep(2.5)
        # driver.implicitly_wait(3)
        # 페이지 맞춤
        # driver.execute_script("document.getElementById('viewerFrame').style.height='3600px';")
        # driver.execute_script("viewer.yex.api.setCurrentScaleValue( this.value );")
        # driver.find_element_by_xpath('//*[@id="selZoom"]/option[2]').click()
        try:
            os.makedirs(dir_path)
        except FileExistsError:
            pass 
        page_cnt = driver.execute_script("return (viewerFrame.contentWindow || viewerFrame.contentDocument).yex.api.getTotalPageCount();")

        for i in range(page_cnt):
            driver.implicitly_wait(3)
            file_name = os.path.join(dir_path, "certification{}.png".format(i + 1))
            driver.save_screenshot(file_name)
            driver.find_element_by_xpath('//*[@id="btnMoveNext"]/button').click()
            crop_nip(dir_path, file_name, page_cnt)
    except:
        not_found_error = True
        alert = driver.switch_to.alert
        alert.accept()
    driver.switch_to.window(driver.window_handles[-1])
    driver.close()
    return not_found_error

def crop_nip(dir_path, file_path, page_cnt):
    img = cv2.imread(file_path)
    path = file_path.split(os.sep)
    file_name = path[-1].split(".")[0]

    # first crop
    x = 45
    y = 320
    width = 580
    height = 250

    cropped_img = img[y: y + height, x: x + width]

    # preprocessing
    gray_cropped_img = cv2.cvtColor(cropped_img, cv2.COLOR_RGB2GRAY)
    ret, th1 = cv2.threshold(gray_cropped_img, 230, 255, cv2.THRESH_BINARY)

    file_name = os.path.join(dir_path, "crop_{}.jpg".format(file_name))
    cv2.imwrite(file_name, th1)

