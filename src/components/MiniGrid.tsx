import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Cell } from './Cell';
import { SubGoal } from '../types/mandalart';
import { getSubGoalColor, MANDALART_COLORS } from '../utils/colors';

interface MiniGridProps {
  subGoal: SubGoal;
  subGoalIndex: number;
  isMainGrid?: boolean;
  mainGoal?: string;
  allSubGoals?: SubGoal[];
  onCellPress?: (type: 'main' | 'subGoal' | 'action', subGoalIndex: number, actionIndex?: number) => void;
  onGridPress?: () => void;
  size?: 'mini' | 'normal';
  gridSize?: number;
}

export function MiniGrid({
  subGoal,
  subGoalIndex,
  isMainGrid = false,
  mainGoal = '',
  allSubGoals = [],
  onCellPress,
  onGridPress,
  size = 'normal',
  gridSize = 145,
}: MiniGridProps) {
  const colors = getSubGoalColor(subGoalIndex);
  const cellSize = (gridSize - 4) / 3; // 3x3 그리드에 맞춰 계산 (padding 제외)
  // 모든 실행계획이 완료되었는지 확인 (blob 효과)
  const isGridComplete = (() => {
    if (!subGoal) return false;
    if (!subGoal.actions || subGoal.actions.length !== 8) return false;
    return subGoal.actions.every(a => a && a.completed);
  })();


  // 메인 그리드 (중앙 3x3): 중앙에 메인목표, 주변에 세부목표들
  if (isMainGrid) {
    const gridItems = [
      { type: 'subGoal' as const, index: 0 },
      { type: 'subGoal' as const, index: 1 },
      { type: 'subGoal' as const, index: 2 },
      { type: 'subGoal' as const, index: 3 },
      { type: 'main' as const, index: -1 },
      { type: 'subGoal' as const, index: 4 },
      { type: 'subGoal' as const, index: 5 },
      { type: 'subGoal' as const, index: 6 },
      { type: 'subGoal' as const, index: 7 },
    ];

    // 메인 그리드 완성 조건: mainGoal이 비어있지 않고, allSubGoals의 text가 모두 채워졌을 때
    const isMainGridComplete = mainGoal && allSubGoals.length === 8 && allSubGoals.every(sg => sg && sg.text && sg.text.trim() !== '');

    return (
      <View style={[styles.grid, styles.mainGrid, { width: gridSize, height: gridSize }, isMainGridComplete && styles.blob]}> 
        {gridItems.map((item, idx) => {
          if (item.type === 'main') {
            return (
              <Cell
                key="main"
                text={mainGoal}
                type="main"
                isCenter
                onPress={() => onCellPress?.('main', -1)}
                cellSize={cellSize}
                noBorder={!!isMainGridComplete}
              />
            );
          }
          const sg = allSubGoals[item.index];
          return (
            <Cell
              key={`subgoal-${item.index}`}
              text={sg?.text || ''}
              type="subGoal"
              subGoalIndex={item.index}
              onPress={() => onCellPress?.('subGoal', item.index)}
              cellSize={cellSize}
              noBorder={!!isMainGridComplete}
            />
          );
        })}
      </View>
    );
  }
   
  // 세부목표 그리드 (외곽 3x3): 중앙에 세부목표, 주변에 액션들
  const actionPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7]; // -1은 중앙(세부목표)

  return (
    <View
      style={[
        styles.grid,
        styles.subGoalGrid,
        { backgroundColor: colors.bg + '30', width: gridSize, height: gridSize },
        isGridComplete && styles.blob,
      ]}
      accessibilityRole="list"
      accessibilityLabel={`세부목표 ${subGoalIndex + 1}: ${subGoal.text || '미입력'}`}
    >
      {onGridPress && (
        <TouchableOpacity
          style={styles.gridPressOverlay}
          onPress={onGridPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`세부목표 ${subGoalIndex + 1} 상세보기`}
        />
      )}
      <View style={styles.cellsContainer}>
        {actionPositions.map((actionIdx, idx) => {
          if (actionIdx === -1) {
            return (
              <Cell
                key={`center-${subGoalIndex}`}
                text={subGoal.text}
                type="subGoal"
                subGoalIndex={subGoalIndex}
                isCenter
                onPress={() => onCellPress?.('subGoal', subGoalIndex)}
                cellSize={cellSize}
                noBorder={!!isGridComplete}
              />
            );
          }
          const action = subGoal.actions[actionIdx];
          return (
            <Cell
              key={`action-${subGoalIndex}-${actionIdx}`}
              text={action?.text || ''}
              type="action"
              subGoalIndex={subGoalIndex}
              completed={action?.completed}
              onPress={() => onCellPress?.('action', subGoalIndex, actionIdx)}
              cellSize={cellSize}
              noBorder={!!isGridComplete}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    padding: 0,
    aspectRatio: 1,
  },
  subGoalGrid: {
    position: 'relative',
  },
  gridPressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  cellsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 1,
  },
  mainGrid: {
    backgroundColor: MANDALART_COLORS.common.surface,
    borderWidth: 1,
    borderColor: MANDALART_COLORS.main.border,
  },
  blob: {
    borderRadius: 60,
    shadowColor: '#c9c9c9',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: 'transparent',
  }
});

