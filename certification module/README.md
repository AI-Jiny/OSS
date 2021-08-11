# Check of K-vaccination certificate
한국 예방 접종 증명서 중 코로나 접종 여부 확인하기 위한 프로그램

## 한국의 예방 접종 증명서를 확인
- 예방 접종 증명서의 문서번호와 이름으로 조회
  - [**정부 24** 인터넷 발급문서 진위확인](https://www.gov.kr/mw/EgovPageLink.do?link=confirm/AA040_confirm_id) 사이트 방문
    - 문서 번호 16자리(4, 4, 4, 4자리) 입력
    - 이름 입력
    - 새 창에서 ezCertForClient 프로그램 통해 증명서 확인
  - [**질병관리청** 예방접종증명서 진위확인](https://nip.kdca.go.kr/irgd/civil.do?MnLv1=2&MnLv2=1) 사이트 방문
    - 문서 번호 17자리(6, 6, 5자리)와 이름 입력

## 자동화 과정
1. 사용자 입력
- 증명서 확인 플랫폼 선택
- 문서번호와 이름 입력

2. 웹 드라이버를 통한 접근
- 크롬 웹드라이버 설치
- 파이썬 selenium 라이브러리 통해 이미지 캡쳐
- 정부 24의 경우 __캡쳐 방지 프로그램(ezCertForClient)__ 실행되기 때문에 다른 방법 필요

3. 코로나 백신 여부 확인
- 증명서 이미지 OCR 처리
  - 파이썬 pytesseract 라이브러리 이용

## 증명서 파이썬 모듈
- path: ./servers/python
```bash
├─main.py : script의 파이썬 모듈 불러옴
├─images
│  ├─1111-1111-1111-1111 : 다운로드 받고 자르기한 이미지 파일
│  ├─gov_list_sample : 정부24의 코로나 관련 템플릿 이미지
│  └─nip_list_sample : 질병관리청의 코로나 관련 템플릿 이미지
└─script
   ├─gov24.py : 정부 24 크롤링하여 증명서 다운로드 및 크롭하는 파일
   └─nip.py   : 질병관리청 크롤링하여 증명서 다운로드 및 크롭하는 파일