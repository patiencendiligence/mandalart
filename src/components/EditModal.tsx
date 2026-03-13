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
import { useTranslation } from '../i18n';

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
  const { t, formatText } = useTranslation();

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
      onClose();
    }
  };

  const getTitle = () => {
    if (!selectedCell) return '';
    switch (selectedCell.type) {
      case 'main':
        return t.editModal.mainGoal;
      case 'subGoal':
        return formatText(t.editModal.subGoal, { index: (selectedCell.subGoalIndex ?? 0) + 1 });
      case 'action':
        return t.editModal.actionPlan;
      default:
        return '';
    }
  };

  const getPlaceholder = () => {
    if (!selectedCell) return '';
    switch (selectedCell.type) {
      case 'main':
        return t.editModal.mainGoalPlaceholder;
      case 'subGoal':
        return t.editModal.subGoalPlaceholder;
      case 'action':
        return t.editModal.actionPlaceholder;
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={[styles.header, { backgroundColor: colors.bg }]}>
            <Text style={styles.title}>{getTitle()}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel={t.common.close}
            >
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
              onKeyPress={(event) => {
                if (event.nativeEvent.key === "Enter") {
                  handleSave();
                }
              }}
              placeholderTextColor={MANDALART_COLORS.common.textMuted}
              multiline
              maxLength={100}
              returnKeyType="done"
              blurOnSubmit
            />

            {/* Hide save button if all actions are completed for subGoal */}
            {(() => {
              if (
                selectedCell?.type === "subGoal" &&
                data &&
                typeof selectedCell.subGoalIndex === "number"
              ) {
                const subGoal = data.subGoals[selectedCell.subGoalIndex];
                if (
                  subGoal &&
                  Array.isArray(subGoal.actions) &&
                  subGoal.actions.length > 0 &&
                  subGoal.actions.every((a) => a.completed)
                ) {
                  return null;
                }
              }

              const saved =
                selectedCell?.subGoalIndex != null &&
                selectedCell?.actionIndex != null
                  ? (data?.subGoals[selectedCell.subGoalIndex]?.actions[
                      selectedCell.actionIndex
                    ]?.text ?? "")
                  : "";
              if (text !== saved || !saved) {
                return (
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      { backgroundColor: "rgba(217, 217, 217, 0.2)" },
                    ]}
                    onPress={handleSave}
                    accessibilityRole="button"
                    accessibilityLabel={t.common.save}
                  >
                    <Text style={styles.saveButtonText}>{t.common.save}</Text>
                  </TouchableOpacity>
                );
              } else {
                // 실행계획(action)인 경우에만 완료/완료취소 버튼 표시
                const isActionType = selectedCell?.type === "action";
                const completeButtonText = isCompleted
                  ? t.editModal.cancelComplete
                  : t.editModal.complete;
                const completeButtonBg = isCompleted
                  ? "rgba(231, 76, 60, 0.6)"
                  : "rgba(39, 174, 96, 0.6)";

                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.saveButton,
                        {
                          backgroundColor: "rgba(172, 172, 172, 0.69)",
                          width: isActionType ? "48%" : "100%",
                        },
                      ]}
                      onPress={handleSave}
                      accessibilityRole="button"
                      accessibilityLabel={t.common.edit}
                    >
                      <Text style={styles.saveButtonText}>{t.common.edit}</Text>
                    </TouchableOpacity>
                    {isActionType && (
                      <TouchableOpacity
                        style={[
                          styles.saveButton,
                          { backgroundColor: completeButtonBg, width: "48%" },
                        ]}
                        onPress={handleComplete}
                        accessibilityRole="button"
                        accessibilityLabel={completeButtonText}
                      >
                        <Text style={styles.saveButtonText}>
                          {completeButtonText}
                        </Text>
                      </TouchableOpacity>
                    )}
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    backgroundColor: 'rgba(242, 242, 247, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 300,
    overflow: 'hidden',
    // Liquid glass border
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
    // Outer shadow
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a3a4a',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: 'rgba(240, 240, 242, 0.8)',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  input: {
    backgroundColor: 'rgba(240, 240, 242, 0.8)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    // 웹에서 포커스 시 파란 outline 제거
    outlineStyle: 'none' as any,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#2a3a4a',
  },
  saveButton: {
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(240, 240, 242, 0.8)',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
});