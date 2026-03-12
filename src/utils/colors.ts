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

// Liquid Glass 스타일 - Apple iOS 26 (테두리 없음, 그림자로 표현)
export const LIQUID_GLASS_STYLE = {
  cell: {
    backgroundColor: 'rgba(187, 187, 188, 0.12)',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  cellCompleted: {
    backgroundColor: 'rgba(187, 187, 188, 0.25)',
    borderColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
};

// Liquid Glass 컨테이너 스타일
export const LIQUID_GLASS_CONTAINER = {
  backgroundColor: 'rgba(187, 187, 188, 0.12)',
  borderWidth: 0,
  borderColor: 'transparent',
  borderRadius: 20,
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 16,
  elevation: 8,
};

// Liquid Glass 버튼 스타일
export const LIQUID_GLASS_BUTTON = {
  backgroundColor: 'rgba(187, 187, 188, 0.2)',
  borderWidth: 0,
  borderColor: 'transparent',
  borderRadius: 99,
  shadowColor: 'rgba(0, 0, 0, 0.08)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 4,
};

