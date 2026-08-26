# 만다라트 (Mandalart) 목표 계획 앱

<p align="center">
  <img src="./assets/no-plans-meme.png" width="300" alt="No plans yet?"/>
</p>

<p align="center"><strong>아직 계획이 없다고요? 걱정 마세요!</strong></p>

오타니 쇼헤이의 목표 달성법으로 유명한 **만다라트** 기법을
활용한 목표 계획 앱입니다.

## 사용해보기

- **웹**: [https://mandart-planner.vercel.app](https://mandart-planner.vercel.app)
- **앱**: 앱스토어 / 구글 플레이 등록중
- **크롬확장프로그램**: 등록중

## 📱 기능

### 9블록 인터페이스

- **중앙**: 최종 목표 (Main Goal)
- **주변 8개**: 세부목표 (Sub Goals)
- **각 세부목표 주변**: 8개의 실행 계획 (Actions)

### 직관적인 줌 인/아웃

- 전체 9x9 그리드 오버뷰
- 세부목표 클릭 시 상세 모달로 줌인
- 모바일 최적화 UI

### 기간별 계획

- **월간 계획**: 매월 목표 설정
- **연간 계획**: 연 단위 큰 목표 설정

### 로컬 저장

- 디바이스에 자동 저장 (AsyncStorage)
- 인터넷 연결 불필요

### 사용자 설정

- 좋아하는 이미지로 배경 설정가능
- 모든 목표를 완료하면 완료된 이미지를 기기에 저장할 수 있어요!
- 언어 설정 가능 (EN/KR)

## 🚀 시작하기

### 설치

```bash
cd mandalart
npm install
```

### 실행

```bash
# Expo 개발 서버 시작
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android
```

### 빌드

```bash
# Android APK/AAB 빌드
npm run build:android

# iOS IPA 빌드
npm run build:ios
```

## 📂 프로젝트 구조

```
mandalart/
├── App.tsx                 # 앱 진입점
├── src/
│   ├── components/         # UI 컴포넌트
│   │   ├── Cell.tsx        # 개별 셀
│   │   ├── MiniGrid.tsx    # 3x3 미니 그리드
│   │   ├── MandalartGrid.tsx  # 9x9 전체 그리드
│   │   ├── EditModal.tsx   # 편집 모달
│   │   ├── DetailModal.tsx # 상세 보기 모달
│   │   └── PeriodSelector.tsx  # 기간 선택
│   ├── hooks/              # 커스텀 훅
│   │   └── useMandalart.ts # 만다라트 데이터 관리
│   ├── screens/            # 화면
│   │   └── HomeScreen.tsx  # 메인 화면
│   ├── storage/            # 로컬 저장소
│   │   └── mandalartStorage.ts
│   ├── types/              # TypeScript 타입
│   │   └── mandalart.ts
│   └── utils/              # 유틸리티
│       └── colors.ts       # 색상 팔레트
├── app.json                # Expo 설정
├── babel.config.js         # Babel 설정
├── package.json
└── tsconfig.json
```

## 📋 사용법

1. **최종 목표 설정**: 중앙의 "목표" 셀을 탭하여 달성하고 싶은 최종 목표 입력
2. **세부목표 설정**: 주변 8개 셀에 목표 달성을 위한 세부 계획 입력
3. **실행계획 작성**: 각 세부목표 그리드를 탭하여 8개의 구체적인 실행 계획 입력
4. **진행 체크**: 실행계획 완료 시 체크하여 진행률 확인

## 🛠 기술 스택

- **React Native** + **Expo**
- **TypeScript**
- **AsyncStorage** (로컬 데이터 저장)
- **React Native Gesture Handler**
- **React Native Reanimated**


---

## Support

이 앱이 도움이 됐다면, 커피 한 잔으로 응원해주세요! [Ko-fi](https://ko-fi.com/H2H61W7DT8)! ☕

---


## 📄 라이선스

MIT License

---

# Mandalart Goal Planning App (English)

<p align="center">
  <img src="./assets/no-plans-meme.png" width="300" alt="No plans yet?"/>
</p>

<p align="center"><strong>No plans yet? Don't worry!</strong></p>

A goal planning app utilizing the **Mandalart** technique, made famous by Shohei Ohtani's goal achievement method.

## Try It Out

- **Web**: [https://mandart-planner.vercel.app](https://mandart-planner.vercel.app)
- **App**: Coming soon to App Store / Google Play
- **Chrome Extension**: Coming soon

## 📱 Features

### 9-Block Interface

- **Center**: Main Goal
- **Surrounding 8 cells**: Sub Goals
- **Around each sub goal**: 8 Action Items

### Intuitive Zoom In/Out

- Full 9x9 grid overview
- Zoom into detail modal on sub goal click
- Mobile-optimized UI

### Time-Based Planning

- **Monthly Plan**: Set goals for each month
- **Yearly Plan**: Set big-picture annual goals

### Local Storage

- Auto-save to device (AsyncStorage)
- No internet connection required

### User Settings

- Set your favorite image as background
- Save completed goal images to your device when all goals are achieved!
- Language settings available (EN/KR)

## 🚀 Getting Started

### Installation

```bash
cd mandalart
npm install
```

### Running

```bash
# Start Expo development server
npm start

# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

### Building

```bash
# Android APK/AAB build
npm run build:android

# iOS IPA build
npm run build:ios
```

## 📂 Project Structure

```
mandalart/
├── App.tsx                 # App entry point
├── src/
│   ├── components/         # UI components
│   │   ├── Cell.tsx        # Individual cell
│   │   ├── MiniGrid.tsx    # 3x3 mini grid
│   │   ├── MandalartGrid.tsx  # 9x9 full grid
│   │   ├── EditModal.tsx   # Edit modal
│   │   ├── DetailModal.tsx # Detail view modal
│   │   └── PeriodSelector.tsx  # Period selector
│   ├── hooks/              # Custom hooks
│   │   └── useMandalart.ts # Mandalart data management
│   ├── screens/            # Screens
│   │   └── HomeScreen.tsx  # Main screen
│   ├── storage/            # Local storage
│   │   └── mandalartStorage.ts
│   ├── types/              # TypeScript types
│   │   └── mandalart.ts
│   └── utils/              # Utilities
│       └── colors.ts       # Color palette
├── app.json                # Expo config
├── babel.config.js         # Babel config
├── package.json
└── tsconfig.json
```

## 📋 How to Use

1. **Set Main Goal**: Tap the center "Goal" cell and enter your ultimate goal
2. **Set Sub Goals**: Enter detailed plans in the 8 surrounding cells to achieve your main goal
3. **Create Action Items**: Tap each sub goal grid to enter 8 specific action items
4. **Track Progress**: Check off completed action items to monitor your progress

## 🛠 Tech Stack

- **React Native** + **Expo**
- **TypeScript**
- **AsyncStorage** (local data storage)
- **React Native Gesture Handler**
- **React Native Reanimated**


---

## Support

If you enjoy this app, consider supporting me on [Ko-fi](https://ko-fi.com/H2H61W7DT8)! ☕

---


## 📄 License

MIT License
