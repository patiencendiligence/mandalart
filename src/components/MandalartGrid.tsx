import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ImageBackground, Platform } from 'react-native';
import { Cell } from './Cell';
import { MandalartData } from '../types/mandalart';


interface MandalartGridProps {
  data: MandalartData;
  onCellPress: (type: 'main' | 'subGoal' | 'action', subGoalIndex: number, actionIndex?: number) => void;
  onSubGoalGridPress: (subGoalIndex: number) => void;
  backgroundImage?: string | null;
}

// 모든 세부목표가 완료되었는지 확인
const isAllSubGoalsCompleted = (data: MandalartData): boolean => {
  return data.subGoals.every(subGoal => {
    const hasActions = subGoal.actions.some(a => a.text?.trim());
    return hasActions && subGoal.actions.every(a => a.completed);
  });
};

const PADDING = 24;
const GRID_PADDING = 12;
const CELL_GAP = 6;

// 3x3 그리드에서 인접 셀 계산
// 배치: [0][1][2]
//       [3][4][5]  (4 = 메인)
//       [6][7][8]
const getAdjacentInfo = (gridIndex: number, completedMap: boolean[]) => {
  const row = Math.floor(gridIndex / 3);
  const col = gridIndex % 3;
  
  const isCompleted = completedMap[gridIndex];
  if (!isCompleted) return { mergeTop: false, mergeBottom: false, mergeLeft: false, mergeRight: false };
  
  const topIdx = row > 0 ? (row - 1) * 3 + col : -1;
  const bottomIdx = row < 2 ? (row + 1) * 3 + col : -1;
  const leftIdx = col > 0 ? row * 3 + (col - 1) : -1;
  const rightIdx = col < 2 ? row * 3 + (col + 1) : -1;
  
  return {
    mergeTop: topIdx >= 0 && completedMap[topIdx],
    mergeBottom: bottomIdx >= 0 && completedMap[bottomIdx],
    mergeLeft: leftIdx >= 0 && completedMap[leftIdx],
    mergeRight: rightIdx >= 0 && completedMap[rightIdx],
  };
};

export function MandalartGrid({
  data,
  onCellPress,
  onSubGoalGridPress,
  backgroundImage,
}: MandalartGridProps) {
  const { width: windowWidth } = useWindowDimensions();
  
  // 반응형 크기 계산
  const gridSize = Math.min(windowWidth - PADDING * 2, 380);
  const cellSize = Math.floor((gridSize - GRID_PADDING * 2 - CELL_GAP * 2) / 3);
  const actualGridSize = cellSize * 3 + CELL_GAP * 2 + GRID_PADDING * 2;
  
  // 중앙 3x3 그리드: 메인목표(중앙) + 세부목표 8개
  // 배치: [0][1][2]
  //       [3][메인][4]
  //       [5][6][7]
  const gridLayout = [
    [{ type: 'subGoal' as const, index: 0 }, { type: 'subGoal' as const, index: 1 }, { type: 'subGoal' as const, index: 2 }],
    [{ type: 'subGoal' as const, index: 3 }, { type: 'main' as const, index: -1 }, { type: 'subGoal' as const, index: 4 }],
    [{ type: 'subGoal' as const, index: 5 }, { type: 'subGoal' as const, index: 6 }, { type: 'subGoal' as const, index: 7 }],
  ];

  // 완료 상태 맵 계산 (세부목표의 모든 액션이 완료된 경우)
  const flatItems = gridLayout.flat();
  const completedMap = flatItems.map((item) => {
    if (item.type === 'main') return false;
    const subGoal = data.subGoals[item.index];
    const hasActions = subGoal?.actions?.some(a => a.text?.trim());
    return hasActions && subGoal.actions.every(a => a.completed);
  });

  const handleSubGoalPress = (index: number) => {
    const subGoal = data.subGoals[index];
    if (subGoal?.text?.trim()) {
      onSubGoalGridPress(index);
    } else {
      onCellPress('subGoal', index);
    }
  };

  // 전체 완료 여부 확인
  const allCompleted = isAllSubGoalsCompleted(data);

  // 완료 시 개별 셀 크기 계산
  const completedCellSize = Math.floor((actualGridSize - GRID_PADDING * 2) / 3);


  // 전체 완료 시 융합된 뷰 렌더링
  if (allCompleted) {
    return (
      <View style={[styles.container]}>
        <View style={[
          styles.glassBackground, 
          { width: actualGridSize + 40, height: actualGridSize + 40 }
        ]}>
          <View style={styles.glassHighlight} />
        </View>
        
        <View style={[styles.completedGrid, { width: actualGridSize, height: actualGridSize }]}>
          {/* 회고 이모티콘 */}
          {data.reflection?.emoji && (
            <View style={styles.reflectionEmojiContainer}>
              <Text style={styles.reflectionEmoji}>{data.reflection.emoji}</Text>
            </View>
          )}
          
          {/* 3x3 그리드 형태로 세부목표 + 메인목표 표시 */}
          <View style={styles.completedGridContent}>
            {gridLayout.map((row, rowIdx) => (
              <View key={`completed-row-${rowIdx}`} style={styles.completedGridRow}>
                {row.map((item, colIdx) => {
                  if (item.type === 'main') {
                    return (
                      <View
                        key="completed-main"
                        style={[
                          styles.completedMainCell,
                          { width: completedCellSize, height: completedCellSize }
                        ]}
                      >
                        <Text style={styles.completedMainGoal} numberOfLines={3}>
                          {data.mainGoal}
                        </Text>
                      </View>
                    );
                  }
                  
                  const subGoal = data.subGoals[item.index];
                  return (
                    <View
                      key={`completed-subgoal-${item.index}`}
                      style={[
                        styles.completedSubGoalCell,
                        { width: completedCellSize, height: completedCellSize }
                      ]}
                    >
                      <Text style={styles.completedSubGoalText} numberOfLines={3}>
                        {subGoal?.text || ''}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          
          {/* 완료 체크 */}
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>✓ 완료</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, backgroundImage && styles.transparentBg]}>
      {/* Liquid Glass 배경 효과 */}
      <View style={[
        styles.glassBackground, 
        { width: actualGridSize + 40, height: actualGridSize + 40 }
      ]}>
        <View style={styles.glassHighlight} />
      </View>
      
      <View style={[styles.grid, { width: actualGridSize }]}>
        {gridLayout.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={styles.gridRow}>
            {row.map((item, colIdx) => {
              const gridIdx = rowIdx * 3 + colIdx;
              const adjacentInfo = getAdjacentInfo(gridIdx, completedMap);
              
              if (item.type === 'main') {
                return (
                  <Cell
                    key="main"
                    text={data.mainGoal}
                    type="main"
                    isCenter
                    onPress={() => onCellPress('main', -1)}
                    cellSize={cellSize}
                  />
                );
              }
              
              const subGoal = data.subGoals[item.index];
              const isCompleted = completedMap[gridIdx];
              
              return (
                <Cell
                  key={`subgoal-${item.index}`}
                  text={subGoal?.text || ''}
                  type="subGoal"
                  subGoalIndex={item.index}
                  onPress={() => handleSubGoalPress(item.index)}
                  cellSize={cellSize}
                  completed={isCompleted}
                  mergeTop={adjacentInfo.mergeTop}
                  mergeBottom={adjacentInfo.mergeBottom}
                  mergeLeft={adjacentInfo.mergeLeft}
                  mergeRight={adjacentInfo.mergeRight}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    overflow: 'hidden',
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backgroundBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    } : {}),
  } as any,
  glassBackground: {
    position: "absolute",
    borderRadius: 20,
    borderWidth: 0,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        backgroundColor: "rgba(187, 187, 188, 0.12)",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        backgroundColor: "rgba(230, 230, 232, 0.95)",
        elevation: 4,
      },
      default: {
        backgroundColor: "rgba(187, 187, 188, 0.12)",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
    }),
  },
  glassHighlight: {
    display: "none",
  },
  grid: {
    flexDirection: "column",
    padding: GRID_PADDING,
  },
  gridRow: {
    flexDirection: "row",
  },
  completedGrid: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 199, 89, 0.12)",
    borderRadius: 20,
    borderWidth: 0,
    padding: GRID_PADDING,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  completedGridContent: {
    flexDirection: 'column',
  },
  completedGridRow: {
    flexDirection: 'row',
  },
  completedMainCell: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    margin: 2,
    padding: 6,
  },
  completedSubGoalCell: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    margin: 2,
    padding: 4,
  },
  completedSubGoalText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 14,
  },
  reflectionEmojiContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 1)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  reflectionEmoji: {
    fontSize: 20,
  },
  completedMainGoal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    lineHeight: 16,
  },
  completedBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(39, 174, 96, 0.75)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(60, 200, 120, 0.85)",
    shadowColor: "rgba(39, 174, 96, 0.3)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
});

