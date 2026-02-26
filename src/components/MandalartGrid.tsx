import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MiniGrid } from './MiniGrid';
import { MandalartData, SubGoal } from '../types/mandalart';
import { MANDALART_COLORS } from '../utils/colors';

interface MandalartGridProps {
  data: MandalartData;
  onCellPress: (type: 'main' | 'subGoal' | 'action', subGoalIndex: number, actionIndex?: number) => void;
  onSubGoalGridPress: (subGoalIndex: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// 화면 가로에 9x9 그리드가 들어가야 함 (3x3 메인그리드 x 3x3 서브셀)
// 따라서 MINI_GRID_SIZE = SCREEN_WIDTH / 3 (각 큰 그리드가 가로 1/3 차지)
// 각 큰 그리드 내 셀 = (MINI_GRID_SIZE - 간격) / 3
const PADDING = 8;
const MINI_GRID_SIZE = (SCREEN_WIDTH - PADDING * 2) / 3; // 큰 그리드 하나의 크기

export function MandalartGrid({
  data,
  onCellPress,
  onSubGoalGridPress,
}: MandalartGridProps) {
  // 모든 세부목표(1~8)가 비어있는지 확인
  const allSubGoalsEmpty = data.subGoals.slice(1).every(sg => !sg.text.trim());

  // 9x9 그리드 배치
  // 위치: [0][1][2]
  //       [3][중앙][4]
  //       [5][6][7]
  
  const gridLayout = [
    [0, 1, 2],
    [3, -1, 4], // -1은 중앙 메인 그리드
    [5, 6, 7],
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
        {gridLayout.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={styles.row}>
            {row.map((gridIdx) => {
              console.log('Rendering grid cell:', { gridIdx, subGoal: data.subGoals[gridIdx] });
              if (gridIdx === -1) {
                // 중앙 메인 그리드
                return (
                  <MiniGrid
                    key="main-grid"
                    subGoal={data.subGoals[0]}
                    subGoalIndex={0}
                    isMainGrid
                    mainGoal={data.mainGoal}
                    allSubGoals={data.subGoals}
                    onCellPress={onCellPress}
                    gridSize={MINI_GRID_SIZE}
                  />
                );
              }
              
              // 세부목표 그리드
              const subGoal = data.subGoals[gridIdx];
              
              // 세부목표가 비어있고 전부 비어있으면 미노출
              if (!subGoal.text.trim() && allSubGoalsEmpty) {
                return null;
              }

              return (
                <MiniGrid
                  key={`subgoal-grid-${gridIdx}`}
                  subGoal={subGoal}
                  subGoalIndex={gridIdx}
                  onCellPress={onCellPress}
                  onGridPress={() => onSubGoalGridPress(gridIdx)}
                  gridSize={MINI_GRID_SIZE}
                />
              );
            })}
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MANDALART_COLORS.common.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: PADDING,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    marginVertical: 2,
    width: '100%',
  },
});

