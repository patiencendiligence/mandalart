import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Cell } from './Cell';
import { SubGoal } from '../types/mandalart';
import { MANDALART_COLORS, getSubGoalColor } from '../utils/colors';

interface DetailModalProps {
  visible: boolean;
  subGoal: SubGoal | null;
  subGoalIndex: number;
  onClose: () => void;
  onCellPress: (type: 'subGoal' | 'action', subGoalIndex: number, actionIndex?: number) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function DetailModal({
  visible,
  subGoal,
  subGoalIndex,
  onClose,
  onCellPress,
}: DetailModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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

  const colors = getSubGoalColor(subGoalIndex);
  const actionPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7];

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
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={[styles.header, { backgroundColor: colors.bg }]}>
            <View style={styles.headerContent}>
              <Text style={[styles.headerLabel, { color: colors.text }]}>
                세부목표 {subGoalIndex + 1}
              </Text>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {subGoal.text || '세부목표를 입력하세요'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
          >
            <Text style={styles.sectionTitle}>실행 계획</Text>
            
            <View style={styles.grid}>
              {actionPositions.map((actionIdx, idx) => {
                if (actionIdx === -1) {
                  // 중앙 - 세부목표
                  return (
                    <TouchableOpacity
                      key="center"
                      style={[
                        styles.centerCell,
                        { backgroundColor: colors.bg, borderColor: colors.border },
                      ]}
                      onPress={() => onCellPress('subGoal', subGoalIndex)}
                    >
                      <Text style={[styles.centerCellText, { color: colors.text }]}>
                        {subGoal.text || '세부목표'}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                
                const action = subGoal.actions[actionIdx];
                return (
                  <TouchableOpacity
                    key={`action-${actionIdx}`}
                    style={[
                      styles.actionCell,
                      { 
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                        opacity: action?.completed ? 0.6 : 1,
                      },
                    ]}
                    onPress={() => onCellPress('action', subGoalIndex, actionIdx)}
                  >
                    <Text style={styles.actionNumber}>{actionIdx + 1}</Text>
                    <Text
                      style={[
                        styles.actionText,
                        { 
                          color: colors.text,
                          textDecorationLine: action?.completed ? 'line-through' : 'none',
                        },
                      ]}
                      numberOfLines={3}
                    >
                      {action?.text || '실행계획 추가'}
                    </Text>
                    {action?.completed && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>진행률</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.accent || colors.text,
                      width: `${(subGoal.actions.filter(a => a.completed).length / 8) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {subGoal.actions.filter(a => a.completed).length} / 8
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const CELL_SIZE = (SCREEN_WIDTH - 80) / 3;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: SCREEN_WIDTH - 40,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: MANDALART_COLORS.common.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: MANDALART_COLORS.common.textSecondary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  centerCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 3,
    padding: 12,
  },
  centerCellText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    position: 'relative',
  },
  actionNumber: {
    position: 'absolute',
    top: 6,
    left: 8,
    fontSize: 10,
    color: MANDALART_COLORS.common.textMuted,
    fontWeight: '600',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: MANDALART_COLORS.common.success,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  progressLabel: {
    fontSize: 14,
    color: MANDALART_COLORS.common.textSecondary,
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: MANDALART_COLORS.common.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: MANDALART_COLORS.common.text,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
});

