import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import { SelectedCell, MandalartData } from '../types/mandalart';
import { MANDALART_COLORS, getSubGoalColor } from '../utils/colors';

interface EditModalProps {
  visible: boolean;
  selectedCell?: SelectedCell;
  data?: MandalartData;
  onClose: () => void;
  onSaveMain: (text: string) => void;
  onSaveSubGoal: (index: number, text: string) => void;
  onSaveAction: (subGoalIndex: number, actionIndex: number, text: string) => void;
  onToggleComplete: (subGoalIndex: number, actionIndex: number) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function EditModal({
  visible,
  selectedCell,
  data,
  onClose,
  onSaveMain,
  onSaveSubGoal,
  onSaveAction,
  onToggleComplete,
}: EditModalProps) {
  const [text, setText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && selectedCell && data) {
      // 현재 값 로드
      if (selectedCell.type === 'main') {
        setText(data.mainGoal);
      } else if (selectedCell.type === 'subGoal' && selectedCell.subGoalIndex !== undefined) {
        setText(data.subGoals[selectedCell.subGoalIndex].text);
      } else if (
        selectedCell.type === 'action' &&
        selectedCell.subGoalIndex !== undefined &&
        selectedCell.actionIndex !== undefined
      ) {
        const action = data.subGoals[selectedCell.subGoalIndex].actions[selectedCell.actionIndex];
        setText(action.text);
        setIsCompleted(action.completed);
      }

      // 슬라이드 애니메이션
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();

      // 포커스
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, selectedCell, data]);

  const handleSave = () => {
    if (!selectedCell) return;
    if (text.trim().length === 0) return;
    if (selectedCell.type === 'main') {
      onSaveMain(text);
    } else if (selectedCell.type === 'subGoal' && selectedCell.subGoalIndex !== undefined) {
      onSaveSubGoal(selectedCell.subGoalIndex, text);
    } else if (
      selectedCell.type === 'action' &&
      selectedCell.subGoalIndex !== undefined &&
      selectedCell.actionIndex !== undefined
    ) {
      onSaveAction(selectedCell.subGoalIndex, selectedCell.actionIndex, text);
    }
    onClose();
  };


  const handleComplete = () => {
    if (
      selectedCell?.type === 'action' &&
      selectedCell.subGoalIndex !== undefined &&
      selectedCell.actionIndex !== undefined
    ) {
      setIsCompleted(!isCompleted);
      onToggleComplete(selectedCell.subGoalIndex, selectedCell.actionIndex);
    }
  };

  const getTitle = () => {
    if (!selectedCell) return '';
    switch (selectedCell.type) {
      case 'main':
        return '🎯 최종 목표';
      case 'subGoal':
        return `세부목표 ${(selectedCell.subGoalIndex ?? 0) + 1}`;
      case 'action':
        return `✓ 실행계획`;
      default:
        return '';
    }
  };

  const getPlaceholder = () => {
    if (!selectedCell) return '';
    switch (selectedCell.type) {
      case 'main':
        return '달성하고 싶은 최종 목표를 입력하세요';
      case 'subGoal':
        return '목표 달성을 위한 세부 계획을 입력하세요';
      case 'action':
        return '구체적인 실행 계획을 입력하세요';
      default:
        return '';
    }
  };

  const colors = selectedCell?.type === 'main'
    ? MANDALART_COLORS.main
    : getSubGoalColor(selectedCell?.subGoalIndex ?? 0);

  // safe accent resolution: some color objects may not have `accent` typed,
  // so prefer explicit runtime check to avoid TypeScript property errors.
  const accentColor = (colors as any)?.accent ?? colors.text ?? colors.bg;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
            selectedCell?.type === 'subGoal' && data?.subGoals[selectedCell.subGoalIndex ?? 0]?.actions?.every(a => a.completed) ? styles.blob : null,
          ]}
        >
          <View style={[styles.header, { backgroundColor: colors.bg }]}>
            <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder={getPlaceholder()}
              placeholderTextColor={MANDALART_COLORS.common.textMuted}
              multiline
              maxLength={100}
              returnKeyType="done"
              blurOnSubmit
            />


            {/* Hide save button if all actions are completed for subGoal */}
            {(() => {
              if (selectedCell?.type === 'subGoal' && data && typeof selectedCell.subGoalIndex === 'number') {
                const subGoal = data.subGoals[selectedCell.subGoalIndex];
                if (subGoal && Array.isArray(subGoal.actions) && subGoal.actions.length > 0 && subGoal.actions.every(a => a.completed)) {
                  return null;
                }
              }
              // {selectedCell?.type === 'action' && (() => {
              // if (
              //   text.trim().length === 0 ||
              //   !(selectedCell && data && typeof selectedCell.subGoalIndex === 'number' && typeof selectedCell.actionIndex === 'number')
              // ) {
              //   return null;
              // }
              const saved = (selectedCell?.subGoalIndex != null && selectedCell?.actionIndex != null)
  ? data?.subGoals[selectedCell.subGoalIndex]?.actions[selectedCell.actionIndex]?.text ?? false
  : false;
              if (text !== saved)  {
                return (
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: 'rgba(217, 217, 217, 0.2)'}]}
                    onPress={handleSave}
                  >
                    <Text style={styles.saveButtonText}>저장</Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <TouchableOpacity
                      style={[styles.saveButton, { backgroundColor: 'rgba(172, 172, 172, 0.69)', width: '48%'}]}
                      onPress={handleSave}
                    >
                      <Text style={styles.saveButtonText}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.saveButton, { backgroundColor: 'rgba(40, 31, 31, 0.59)', width: '48%'}]}
                      onPress={handleComplete}
                    >
                      <Text style={styles.saveButtonText}>완료</Text>
                    </TouchableOpacity>
                  </View>
                );
              }

            })()}
              
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
    blob: {
      borderRadius: 32,
      shadowColor: '#c9c9c9',
      shadowOffset: { width: 10, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
      backgroundColor: 'rgba(255,255,255,0.22)',
      borderWidth: 2,
      borderColor: '#e0e0e0',
    },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 300,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
    // iOS only: backdrop blur
    // Android: fallback to backgroundColor
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 0
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeText: {
    fontSize: 16,
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: MANDALART_COLORS.common.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: MANDALART_COLORS.common.text,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});