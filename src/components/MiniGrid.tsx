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
}: MiniGridProps) {
  const colors = getSubGoalColor(subGoalIndex);
  const cellSize = size === 'mini' ? 'small' : 'medium';

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

    return (
      <View style={[styles.grid, styles.mainGrid]}>
        {gridItems.map((item, idx) => {
          if (item.type === 'main') {
            return (
              <Cell
                key="main"
                text={mainGoal}
                type="main"
                isCenter
                onPress={() => onCellPress?.('main', -1)}
                size={cellSize}
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
              size={cellSize}
            />
          );
        })}
      </View>
    );
  }

  // 세부목표 그리드 (외곽 3x3): 중앙에 세부목표, 주변에 액션들
  const actionPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7]; // -1은 중앙(세부목표)

  return (
    <TouchableOpacity
      style={[styles.grid, { backgroundColor: colors.bg + '30' }]}
      onPress={onGridPress}
      activeOpacity={0.8}
    >
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
              size={cellSize}
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
            size={cellSize}
          />
        );
      })}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 145,
    height: 145,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 2,
  },
  mainGrid: {
    backgroundColor: MANDALART_COLORS.common.surface,
    borderWidth: 2,
    borderColor: MANDALART_COLORS.main.border,
  },
});

