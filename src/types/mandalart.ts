// 만다라트 데이터 타입 정의

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
}

// 세부목표 (3x3 그리드의 중심)
export interface SubGoal {
  id: string;
  text: string;
  position: number; // 0-7 (중앙 제외)
  actions: ActionItem[]; // 8개의 실행 항목
}

// 만다라트 전체 구조
export interface MandalartData {
  id: string;
  mainGoal: string; // 중앙의 최종 목표
  subGoals: SubGoal[]; // 8개의 세부목표
  period: 'monthly' | 'yearly';
  year: number;
  month?: number; // monthly인 경우에만
  createdAt: string;
  updatedAt: string;
}

// 뷰 모드
export type ViewMode = 'overview' | 'detail';

// 줌 레벨 (캘린더 기능용)
export type ZoomLevel = 'daily' | 'weekly' | 'monthly';

// 선택된 셀 정보
export interface SelectedCell {
  type: 'main' | 'subGoal' | 'action';
  subGoalIndex?: number; // 세부목표 인덱스 (0-7)
  actionIndex?: number; // 액션 인덱스 (0-7)
}

// 3x3 그리드 내 위치 매핑 (중앙=4, 나머지 0-3, 5-8)
export const GRID_POSITIONS = {
  TOP_LEFT: 0,
  TOP_CENTER: 1,
  TOP_RIGHT: 2,
  MIDDLE_LEFT: 3,
  CENTER: 4,
  MIDDLE_RIGHT: 5,
  BOTTOM_LEFT: 6,
  BOTTOM_CENTER: 7,
  BOTTOM_RIGHT: 8,
} as const;

// 세부목표 위치를 9x9 그리드 위치로 변환
export const SUB_GOAL_TO_OUTER_POSITION: Record<number, { row: number; col: number }> = {
  0: { row: 0, col: 0 }, // 좌상단
  1: { row: 0, col: 1 }, // 상단
  2: { row: 0, col: 2 }, // 우상단
  3: { row: 1, col: 0 }, // 좌측
  4: { row: 1, col: 2 }, // 우측
  5: { row: 2, col: 0 }, // 좌하단
  6: { row: 2, col: 1 }, // 하단
  7: { row: 2, col: 2 }, // 우하단
};

// 빈 만다라트 생성 헬퍼
export function createEmptyMandalart(period: 'monthly' | 'yearly', year: number, month?: number): MandalartData {
  const now = new Date().toISOString();
  
  return {
    id: `${period}-${year}${month ? `-${month}` : ''}`,
    mainGoal: '',
    subGoals: Array.from({ length: 8 }, (_, i) => ({
      id: `subgoal-${i}`,
      text: '',
      position: i,
      actions: Array.from({ length: 8 }, (_, j) => ({
        id: `action-${i}-${j}`,
        text: '',
        completed: false,
      })),
    })),
    period,
    year,
    month,
    createdAt: now,
    updatedAt: now,
  };
}

