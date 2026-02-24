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

export function MandalartGrid({
  data,
  onCellPress,
  onSubGoalGridPress,
}: MandalartGridProps) {
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
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {gridLayout.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={styles.row}>
            {row.map((gridIdx) => {
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
                  />
                );
              }
              
              // 세부목표 그리드
              const subGoal = data.subGoals[gridIdx];
              return (
                <MiniGrid
                  key={`subgoal-grid-${gridIdx}`}
                  subGoal={subGoal}
                  subGoalIndex={gridIdx}
                  onCellPress={onCellPress}
                  onGridPress={() => onSubGoalGridPress(gridIdx)}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 2,
  },
});

