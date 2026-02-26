// 만다라트 색상 팔레트 - 각 세부목표에 고유한 색상 할당

export const MANDALART_COLORS = {
  // 메인 목표 (중앙)
  main: {
    bg: '#1a1a2e',
    text: '#ffffff',
    border: '#16213e',
  },
  
  // 세부목표 색상 (8개)
  subGoals: [
    { bg: 'rgba(0,0,0,0)', text: '#f7f7f7', border: '#f5cba7', accent: '#e67e22' }, // 주황
    { bg: 'rgba(0,0,0,0)', text: '#f7f7f7', border: '#a3e4d7', accent: '#16a085' }, // 청록
    { bg: 'rgba(0,0,0,0)', text: '#f7f7f7', border: '#f9e79f', accent: '#d68910' }, // 노랑
    { bg: 'rgba(0,0,0,0)', text: '#f7f7f7', border: '#d7bde2', accent: '#8e44ad' }, // 보라
    { bg: 'rgba(0,0,0,0)', text: '#f7f7f7', border: '#aed6f1', accent: '#2980b9' }, // 파랑
    { bg: 'rgba(0,0,0,0)', text: '#f7f7f7', border: '#f5b7b1', accent: '#c0392b' }, // 빨강
    { bg: 'rgba(0,0,0,0)', text: '#f7f7f7', border: '#a9dfbf', accent: '#1e8449' }, // 초록
    { bg: 'rgba(0,0,0,0)', text: '#f7f7f7', border: '#edbb99', accent: '#ca6f1e' }, // 갈색
  ],
  
  // 공통 색상
  common: {
    background: '#040409',
    surface: '#1a1a2e',
    surfaceLight: '#252542',
    text: '#eef2ff',
    textSecondary: '#a8b2d1',
    textMuted: '#6272a4',
    border: '#2d2d44',
    success: '#50fa7b',
    warning: '#ffb86c',
    error: '#ff5555',
  },
};

// 세부목표 인덱스에 따른 색상 가져오기
export function getSubGoalColor(index: number) {
  return MANDALART_COLORS.subGoals[index % MANDALART_COLORS.subGoals.length];
}

// 완료된 항목 색상
export function getCompletedColor(baseColor: string) {
  return baseColor + '80'; // 50% 투명도
}

