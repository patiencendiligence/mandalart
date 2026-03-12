// Liquid Glass UI - Apple iOS 26 Style (Minimal, Neutral)

export const MANDALART_COLORS = {
  // 메인 목표 (중앙)
  main: {
    bg: 'rgba(187, 187, 188, 0.15)',
    text: '#333',
    border: 'transparent',
    glow: 'rgba(255, 255, 255, 0.3)',
  },
  
  // 세부목표 색상 (8개) - 무채색 유리
  subGoals: [
    { bg: 'rgba(187, 187, 188, 0.12)', text: '#333', border: 'transparent', accent: '#bbb', glow: 'rgba(255, 255, 255, 0.2)' },
    { bg: 'rgba(187, 187, 188, 0.12)', text: '#333', border: 'transparent', accent: '#bbb', glow: 'rgba(255, 255, 255, 0.2)' },
    { bg: 'rgba(187, 187, 188, 0.12)', text: '#333', border: 'transparent', accent: '#bbb', glow: 'rgba(255, 255, 255, 0.2)' },
    { bg: 'rgba(187, 187, 188, 0.12)', text: '#333', border: 'transparent', accent: '#bbb', glow: 'rgba(255, 255, 255, 0.2)' },
    { bg: 'rgba(187, 187, 188, 0.12)', text: '#333', border: 'transparent', accent: '#bbb', glow: 'rgba(255, 255, 255, 0.2)' },
    { bg: 'rgba(187, 187, 188, 0.12)', text: '#333', border: 'transparent', accent: '#bbb', glow: 'rgba(255, 255, 255, 0.2)' },
    { bg: 'rgba(187, 187, 188, 0.12)', text: '#333', border: 'transparent', accent: '#bbb', glow: 'rgba(255, 255, 255, 0.2)' },
    { bg: 'rgba(187, 187, 188, 0.12)', text: '#333', border: 'transparent', accent: '#bbb', glow: 'rgba(255, 255, 255, 0.2)' },
  ],
  
  // Liquid Glass 공통 색상
  common: {
    background: '#e8e8e9',
    backgroundGradientStart: '#e8e8e9',
    backgroundGradientEnd: '#ddd',
    surface: 'rgba(187, 187, 188, 0.12)',
    surfaceLight: 'rgba(187, 187, 188, 0.2)',
    glass: 'rgba(187, 187, 188, 0.12)',
    glassBorder: 'transparent',
    glassHighlight: 'rgba(255, 255, 255, 0.5)',
    text: '#224',
    textSecondary: '#666',
    textMuted: '#999',
    border: 'transparent',
    success: '#34c759',
    warning: '#ff9500',
    error: '#ff3b30',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },

  // Liquid Glass 완료 상태 색상
  completed: {
    bg: 'rgba(187, 187, 188, 0.25)',
    border: 'transparent',
    glow: 'rgba(255, 255, 255, 0.4)',
    highlight: 'rgba(255, 255, 255, 0.6)',
  },
};

// 세부목표 인덱스에 따른 색상 가져오기
export function getSubGoalColor(index: number) {
  return MANDALART_COLORS.subGoals[index % MANDALART_COLORS.subGoals.length];
}

// 완료된 항목 색상
export function getCompletedColor(baseColor: string) {
  return baseColor + '80';
}

// Liquid Glass 스타일 - Apple iOS 26 (입체감 있는 유리 효과 + blur)
export const LIQUID_GLASS_STYLE = {
  cell: {
    // 반투명 배경 (blur 효과와 함께)
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    // Liquid glass border: 위/왼쪽 밝게, 아래/오른쪽 어둡게
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    // Outer shadow
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  cellCompleted: {
    // Inset 효과: 눌린 느낌의 반투명 배경
    backgroundColor: 'rgba(180, 200, 230, 0.4)',
    // Inset border: 위/왼쪽 어둡게, 아래/오른쪽 밝게
    borderWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.15)',
    borderLeftColor: 'rgba(0, 0, 0, 0.12)',
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
    borderRightColor: 'rgba(255, 255, 255, 0.8)',
    // 외부 shadow 제거
    shadowOpacity: 0,
    elevation: 0,
  },
};

// Liquid Glass 컨테이너 스타일
export const LIQUID_GLASS_CONTAINER = {
  backgroundColor: 'rgba(242, 242, 247, 0.95)',
  borderRadius: 24,
  // Liquid glass border
  borderWidth: 1.5,
  borderTopColor: 'rgba(255, 255, 255, 0.8)',
  borderLeftColor: 'rgba(255, 255, 255, 0.7)',
  borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  borderRightColor: 'rgba(0, 0, 0, 0.08)',
  // Outer shadow
  shadowColor: 'rgba(0, 0, 0, 0.2)',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 20,
  elevation: 12,
};

// Liquid Glass 버튼 스타일
export const LIQUID_GLASS_BUTTON = {
  backgroundColor: 'rgba(240, 240, 242, 0.85)',
  borderRadius: 99,
  // Liquid glass border
  borderWidth: 1,
  borderTopColor: 'rgba(255, 255, 255, 0.6)',
  borderLeftColor: 'rgba(255, 255, 255, 0.5)',
  borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  borderRightColor: 'rgba(0, 0, 0, 0.06)',
  // Outer shadow
  shadowColor: 'rgba(0, 0, 0, 0.12)',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 5,
};

// Liquid Glass 버튼 Active 상태 (눌린 느낌)
export const LIQUID_GLASS_BUTTON_ACTIVE = {
  backgroundColor: 'rgba(210, 220, 235, 0.6)',
  borderRadius: 99,
  // Inset border
  borderWidth: 1,
  borderTopColor: 'rgba(0, 0, 0, 0.12)',
  borderLeftColor: 'rgba(0, 0, 0, 0.1)',
  borderBottomColor: 'rgba(255, 255, 255, 0.8)',
  borderRightColor: 'rgba(255, 255, 255, 0.7)',
  // 외부 shadow 제거
  shadowOpacity: 0,
  elevation: 0,
};

