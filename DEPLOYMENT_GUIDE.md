# 배포 가이드

## 사전 준비

### 1. 개발자 계정 등록

#### Apple Developer Program
1. https://developer.apple.com/programs/ 접속
2. "Enroll" 클릭
3. Apple ID로 로그인
4. 개인/조직 선택 후 정보 입력
5. 연회비 $99 결제
6. 승인까지 1-2일 소요

#### Google Play Console
1. https://play.google.com/console/signup 접속
2. Google 계정으로 로그인
3. 개발자 정보 입력
4. 일회성 등록비 $25 결제
5. 즉시 또는 수일 내 승인

#### Chrome Web Store Developer
1. https://chrome.google.com/webstore/devconsole 접속
2. Google 계정으로 로그인
3. 일회성 등록비 $5 결제
4. 즉시 사용 가능

---

## 크롬 확장프로그램 배포

### 1. 빌드
```bash
npm run build:chrome
```

### 2. 테스트
1. Chrome에서 `chrome://extensions` 열기
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `chrome-extension` 폴더 선택

### 3. 제출
1. https://chrome.google.com/webstore/devconsole 접속
2. "새 항목" 클릭
3. `mandalart-extension.zip` 업로드
4. 스토어 리스팅 정보 입력:
   - 이름, 설명 (STORE_LISTING.md 참조)
   - 스크린샷 (1280x800 또는 640x400)
   - 아이콘 (128x128)
   - 카테고리: 생산성
5. 개인정보 처리방침 URL 입력
6. "게시" 클릭

---

## iOS 앱스토어 배포

### 1. EAS 프로젝트 연결
```bash
eas login
eas init
```

### 2. 프로덕션 빌드
```bash
eas build --platform ios --profile production
```

### 3. App Store Connect 설정
1. https://appstoreconnect.apple.com 접속
2. "내 앱" > "+" > "신규 앱"
3. 앱 정보 입력:
   - 이름: 만다라트
   - 기본 언어: 한국어
   - 번들 ID: com.mandalart.app
   - SKU: mandalart-app

### 4. 앱 정보 입력
- 앱 설명, 키워드, 지원 URL
- 스크린샷 업로드 (필수 크기):
  - iPhone 6.7" (1290 x 2796)
  - iPhone 6.5" (1284 x 2778)
  - iPhone 5.5" (1242 x 2208)
  - iPad Pro 12.9" (2048 x 2732) - 태블릿 지원 시
- 앱 아이콘 (1024 x 1024)
- 개인정보 처리방침 URL
- 카테고리: 생산성
- 연령 등급: 4+

### 5. 앱 제출
```bash
eas submit --platform ios
```

또는 App Store Connect에서 직접 빌드 선택 후 제출

### 6. 심사
- 소요 시간: 보통 1-3일 (최대 7일)
- 거절 시 피드백에 따라 수정 후 재제출

---

## 구글 플레이스토어 배포

### 1. 프로덕션 빌드
```bash
eas build --platform android --profile production
```

### 2. Google Play Console 설정
1. https://play.google.com/console 접속
2. "앱 만들기" 클릭
3. 앱 정보 입력:
   - 앱 이름: 만다라트
   - 기본 언어: 한국어
   - 앱/게임: 앱
   - 유료/무료: 무료

### 3. 스토어 등록정보
- 짧은 설명 (80자)
- 전체 설명 (4000자)
- 스크린샷 (최소 2개, 권장 8개)
  - 휴대전화: 최소 320px, 최대 3840px
- 그래픽 이미지 (1024 x 500)
- 고해상도 아이콘 (512 x 512)

### 4. 콘텐츠 등급
- 설문지 작성 후 등급 받기

### 5. 앱 제출
```bash
eas submit --platform android
```

또는:
1. "프로덕션" > "새 버전 만들기"
2. AAB 파일 업로드
3. 버전 정보 입력
4. "검토를 위해 출시" 클릭

### 6. 심사
- 소요 시간: 보통 수시간 ~ 3일

---

## 업데이트 배포

### 버전 번호 업데이트
`app.json` 수정:
```json
{
  "expo": {
    "version": "1.1.0",  // 앱 버전
    "ios": {
      "buildNumber": "2"  // iOS 빌드 번호
    },
    "android": {
      "versionCode": 2  // Android 버전 코드
    }
  }
}
```

### 빌드 및 제출
```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android

# 크롬 확장프로그램
npm run build:chrome
# Chrome Web Store에서 새 버전 업로드
```

---

## 체크리스트

### 배포 전 확인사항
- [ ] 모든 기능 테스트 완료
- [ ] 개인정보 처리방침 페이지 게시
- [ ] 스크린샷 준비 (각 플랫폼 요구사양)
- [ ] 앱 아이콘 준비 (고해상도)
- [ ] 스토어 설명문 작성
- [ ] 키워드/태그 설정
- [ ] 연락처 이메일 설정

### 제출 후 확인사항
- [ ] 심사 상태 모니터링
- [ ] 거절 시 피드백 확인 및 수정
- [ ] 승인 후 스토어에서 앱 확인
- [ ] 다운로드 및 설치 테스트
