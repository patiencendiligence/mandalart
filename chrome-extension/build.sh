#!/bin/bash

# 만다라트 크롬 확장프로그램 빌드 스크립트

set -e

echo "1. 웹 앱 빌드 중..."
cd "$(dirname "$0")/.."
npx expo export --platform web --output-dir chrome-extension/dist

echo "2. 아이콘 생성 중..."
# 아이콘이 없는 경우 기본 아이콘 사용
if [ -f "assets/icon.png" ]; then
  # sips 명령어로 아이콘 리사이징 (macOS)
  sips -z 16 16 assets/icon.png --out chrome-extension/icons/icon16.png 2>/dev/null || cp assets/icon.png chrome-extension/icons/icon16.png
  sips -z 48 48 assets/icon.png --out chrome-extension/icons/icon48.png 2>/dev/null || cp assets/icon.png chrome-extension/icons/icon48.png
  sips -z 128 128 assets/icon.png --out chrome-extension/icons/icon128.png 2>/dev/null || cp assets/icon.png chrome-extension/icons/icon128.png
fi

echo "3. ZIP 패키징 중..."
cd chrome-extension
zip -r ../mandalart-extension.zip . -x "*.sh" -x "*.DS_Store"

echo ""
echo "빌드 완료!"
echo "확장프로그램 파일: mandalart-extension.zip"
echo ""
echo "테스트 방법:"
echo "1. chrome://extensions 열기"
echo "2. '개발자 모드' 활성화"
echo "3. '압축해제된 확장 프로그램을 로드합니다' 클릭"
echo "4. chrome-extension 폴더 선택"
