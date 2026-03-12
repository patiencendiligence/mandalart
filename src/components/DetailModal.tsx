import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SubGoal } from '../types/mandalart';
import { MANDALART_COLORS } from '../utils/colors';

interface DetailModalProps {
  visible: boolean;
  subGoal: SubGoal | null;
  subGoalIndex: number;
  onClose: () => void;
  onCellPress: (type: 'subGoal' | 'action', subGoalIndex: number, actionIndex?: number) => void;
  onCompleteAll?: (subGoalIndex: number) => void;
}

// 3x3 그리드에서 인접 완료 셀 계산
const getAdjacentMergeInfo = (gridIndex: number, completedMap: boolean[]) => {
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

const GRID_GAP = 6;
const MODAL_HORIZONTAL_MARGIN = 40;
const MODAL_PADDING = 20;

export function DetailModal({
  visible,
  subGoal,
  subGoalIndex,
  onClose,
  onCellPress,
  onCompleteAll,
}: DetailModalProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // 반응형 크기 계산
  const modalWidth = Math.min(windowWidth - MODAL_HORIZONTAL_MARGIN, 400);
  const gridWidth = modalWidth - MODAL_PADDING * 2;
  const cellSize = Math.floor((gridWidth - GRID_GAP * 2) / 3);
  const actualGridWidth = cellSize * 3 + GRID_GAP * 2;
  const cellBorderRadius = cellSize * 0.2;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!subGoal) return null;

  // 배치: [0][1][2]  -> actionIdx: 0,1,2
  //       [3][중앙][4] -> actionIdx: 3,-1,4
  //       [5][6][7]  -> actionIdx: 5,6,7
  const actionPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7];
  
  // 완료 상태 맵 (그리드 인덱스 기준)
  const completedMap = actionPositions.map((actionIdx) => {
    if (actionIdx === -1) return false;
    return subGoal.actions[actionIdx]?.completed || false;
  });

  const completedCount = subGoal.actions.filter(a => a.completed).length;
  const progressPercent = (completedCount / 8) * 100;
  
  // 모든 실행계획이 저장되었는지 확인 (텍스트가 있는지)
  const allActionsSaved = subGoal.actions.every(a => a.text?.trim());
  // 모든 실행계획이 완료되었는지 확인
  const allActionsCompleted = subGoal.actions.every(a => a.completed);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          onPress={onClose} 
          activeOpacity={1} 
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              width: modalWidth,
              maxHeight: windowHeight * 0.85,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Liquid Glass 하이라이트 */}
          <View style={styles.glassHighlight} />
          
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerLabel}>
                세부목표 {subGoalIndex + 1}
              </Text>
              <Text style={styles.headerTitle}>
                {subGoal.text || '세부목표를 입력하세요'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="닫기"
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>실행 계획</Text>
              {allActionsSaved && !allActionsCompleted && onCompleteAll && (
                <TouchableOpacity 
                  style={styles.completeAllButton}
                  onPress={() => onCompleteAll(subGoalIndex)}
                  accessibilityRole="button"
                  accessibilityLabel="전체 완료"
                >
                  <Text style={styles.completeAllButtonText}>전체 완료</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={[styles.grid, { width: actualGridWidth }]}>
              {[0, 1, 2].map((rowIdx) => (
                <View key={`row-${rowIdx}`} style={styles.gridRow}>
                  {[0, 1, 2].map((colIdx) => {
                    const gridIdx = rowIdx * 3 + colIdx;
                    const actionIdx = actionPositions[gridIdx];
                    const mergeInfo = getAdjacentMergeInfo(gridIdx, completedMap);
                    
                    const baseMargin = GRID_GAP / 2;
                    
                    if (actionIdx === -1) {
                      return (
                        <TouchableOpacity
                          key="center"
                          style={[
                            styles.centerCell,
                            { 
                              width: cellSize, 
                              height: cellSize,
                              borderRadius: cellBorderRadius,
                              margin: baseMargin,
                            }
                          ]}
                          onPress={() => onCellPress('subGoal', subGoalIndex)}
                          activeOpacity={0.8}
                        >
                          <View style={[styles.cellGlassHighlight, { borderRadius: cellBorderRadius }]} />
                          <Text style={styles.centerCellText}>
                            {subGoal.text || '세부목표'}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                    
                    const action = subGoal.actions[actionIdx];
                    const isCompleted = action?.completed || false;
                    
                    const baseCellStyle = {
                      width: cellSize,
                      height: cellSize,
                      borderRadius: cellBorderRadius,
                    };
                    
                    // 완료된 셀의 연결 스타일 (borderRadius + border + margin)
                    const mergeStyles = isCompleted ? {
                      borderTopLeftRadius: (mergeInfo.mergeTop || mergeInfo.mergeLeft) ? 4 : cellBorderRadius,
                      borderTopRightRadius: (mergeInfo.mergeTop || mergeInfo.mergeRight) ? 4 : cellBorderRadius,
                      borderBottomLeftRadius: (mergeInfo.mergeBottom || mergeInfo.mergeLeft) ? 4 : cellBorderRadius,
                      borderBottomRightRadius: (mergeInfo.mergeBottom || mergeInfo.mergeRight) ? 4 : cellBorderRadius,
                      borderTopWidth: mergeInfo.mergeTop ? 0 : 1.5,
                      borderBottomWidth: mergeInfo.mergeBottom ? 0 : 1.5,
                      borderLeftWidth: mergeInfo.mergeLeft ? 0 : 1.5,
                      borderRightWidth: mergeInfo.mergeRight ? 0 : 1.5,
                      marginTop: mergeInfo.mergeTop ? 0 : baseMargin,
                      marginBottom: mergeInfo.mergeBottom ? 0 : baseMargin,
                      marginLeft: mergeInfo.mergeLeft ? 0 : baseMargin,
                      marginRight: mergeInfo.mergeRight ? 0 : baseMargin,
                    } : {
                      margin: baseMargin,
                    };
                    
                    return (
                      <TouchableOpacity
                        key={`action-${actionIdx}`}
                        style={[
                          styles.actionCell,
                          baseCellStyle,
                          isCompleted && styles.actionCellCompleted,
                          mergeStyles,
                        ]}
                        onPress={() => onCellPress('action', subGoalIndex, actionIdx)}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.cellGlassHighlight, { borderRadius: cellBorderRadius }]} />
                        <Text style={styles.actionNumber}>{actionIdx + 1}</Text>
                        <Text
                          style={[
                            styles.actionText,
                            isCompleted && styles.actionTextCompleted,
                          ]}
                          numberOfLines={3}
                        >
                          {action?.text || '실행계획 추가'}
                        </Text>
                        {isCompleted && (
                          <View style={styles.checkmark}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>진행률</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {completedCount} / 8
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
  },
  glassHighlight: {
    display: 'none',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 24,
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MANDALART_COLORS.common.textSecondary,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MANDALART_COLORS.common.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
    borderWidth: 0,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: MANDALART_COLORS.common.textSecondary,
  },
  completeAllButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: '#34c759',
    borderWidth: 0,
  },
  completeAllButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  grid: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
  },
  centerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
    padding: 12,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  centerCellText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  cellGlassHighlight: {
    display: 'none',
  },
  actionCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: 'rgba(187, 187, 188, 0.12)',
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionCellCompleted: {
    backgroundColor: 'rgba(187, 187, 188, 0.22)',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowRadius: 8,
    elevation: 8,
  },
  actionNumber: {
    position: 'absolute',
    top: 6,
    left: 8,
    fontSize: 10,
    color: MANDALART_COLORS.common.textMuted,
    fontWeight: '600',
    zIndex: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    color: MANDALART_COLORS.common.text,
    zIndex: 1,
  },
  actionTextCompleted: {
    opacity: 0.7,
  },
  checkmark: {
    position: 'absolute',
    top: 3,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34c759',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 0,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  progressLabel: {
    fontSize: 14,
    color: MANDALART_COLORS.common.textSecondary,
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#34c759',
  },
  progressText: {
    fontSize: 14,
    color: MANDALART_COLORS.common.text,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
});

