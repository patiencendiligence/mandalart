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
  ScrollView,
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
  onSaveAllSubGoals?: (texts: string[]) => void;
  onSaveAllActions?: (subGoalIndex: number, texts: string[]) => void;
}

export function EditModal({
  visible,
  selectedCell,
  data,
  onClose,
  onSaveMain,
  onSaveSubGoal,
  onSaveAction,
  onToggleComplete,
  onSaveAllSubGoals,
  onSaveAllActions,
}: EditModalProps) {
  const [text, setText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [batchTexts, setBatchTexts] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const inputRef = useRef<TextInput>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { t, formatText } = useTranslation();

  // 세부목표들이 모두 비어있는지 확인
  const areAllSubGoalsEmpty = data?.subGoals.every(sg => !sg.text?.trim()) ?? true;
  
  // 현재 세부목표의 실행계획들이 모두 비어있는지 확인
  const areAllActionsEmpty = (subGoalIndex: number) => {
    if (!data || subGoalIndex < 0 || subGoalIndex >= data.subGoals.length) return true;
    return data.subGoals[subGoalIndex].actions.every(a => !a.text?.trim());
  };

  // 배치 입력 모드 타입: 'subGoals' | 'actions' | null
  const getBatchMode = (): 'subGoals' | 'actions' | null => {
    if (!selectedCell || !data) return null;
    
    // 세부목표 셀 클릭 시 + 모든 세부목표가 비어있으면 → 세부목표 배치 입력
    if (selectedCell.type === 'subGoal' && areAllSubGoalsEmpty) {
      return 'subGoals';
    }
    
    // 세부목표 셀 클릭 시 + 해당 세부목표가 있고 + 실행계획이 모두 비어있으면 → 실행계획 배치 입력
    if (selectedCell.type === 'subGoal' && 
        selectedCell.subGoalIndex !== undefined &&
        data.subGoals[selectedCell.subGoalIndex]?.text?.trim() &&
        areAllActionsEmpty(selectedCell.subGoalIndex)) {
      return 'actions';
    }
    
    // 실행계획 셀 클릭 시 + 모든 실행계획이 비어있으면 → 실행계획 배치 입력
    if (selectedCell.type === 'action' && 
        selectedCell.subGoalIndex !== undefined &&
        areAllActionsEmpty(selectedCell.subGoalIndex)) {
      return 'actions';
    }
    
    return null;
  };

  useEffect(() => {
    if (visible && selectedCell && data) {
      // 배치 입력 초기화
      setBatchTexts(['', '', '', '', '', '', '', '']);
      setErrorIndex(null);
      
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

      // 포커스
      setTimeout(() => inputRef.current?.focus(), 300);
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

  const handleBatchSave = () => {
    if (!selectedCell) return;
    
    // 모든 입력이 채워졌는지 확인
    const firstEmptyIndex = batchTexts.findIndex(t => !t.trim());
    if (firstEmptyIndex !== -1) {
      // 첫 번째 빈 입력 필드에 에러 표시
      setErrorIndex(firstEmptyIndex);
      // 해당 입력 필드에 포커스
      setTimeout(() => {
        inputRefs.current[firstEmptyIndex]?.focus();
      }, 100);
      return;
    }

    const batchMode = getBatchMode();
    
    if (batchMode === 'subGoals' && onSaveAllSubGoals) {
      onSaveAllSubGoals(batchTexts);
    } else if (batchMode === 'actions' && 
               selectedCell.subGoalIndex !== undefined && 
               onSaveAllActions) {
      onSaveAllActions(selectedCell.subGoalIndex, batchTexts);
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

  const getBatchTitle = () => {
    const batchMode = getBatchMode();
    if (batchMode === 'subGoals') {
      const mainGoal = data?.mainGoal || '';
      return formatText(t.editModal.batchSubGoals || '{{mainGoal}}를 이루기 위한 세부목표들', { mainGoal });
    }
    if (batchMode === 'actions' && selectedCell?.subGoalIndex !== undefined) {
      const subGoal = data?.subGoals[selectedCell.subGoalIndex]?.text || '';
      return formatText(t.editModal.batchActions || '{{subGoal}}을 이루기 위한 실행계획들', { subGoal });
    }
    return '';
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

  const batchMode = getBatchMode();
  const isBatchMode = batchMode !== null;

  const renderBatchInputs = () => {
    const batchMode = getBatchMode();
    const labelPrefix = batchMode === 'subGoals'
      ? (t.editModal.subGoalLabel || '세부목표') 
      : (t.editModal.actionLabel || '실행계획');
    const errorMessage = t.editModal.fillRequired || '입력해주세요';
    
    return (
      <>
        <View style={styles.batchContainer}>
          <ScrollView 
            style={styles.batchScrollView} 
            showsVerticalScrollIndicator
            contentContainerStyle={styles.batchScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {batchTexts.map((value, index) => {
              const hasError = errorIndex === index;
              return (
                <View key={index} style={styles.batchInputRow}>
                  <Text style={[
                    styles.batchInputLabel,
                    hasError && styles.batchInputLabelError
                  ]}>{index + 1}</Text>
                  <TextInput
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={[
                      styles.batchInput,
                      hasError && styles.batchInputError
                    ]}
                    value={value}
                    onChangeText={(newText) => {
                      const newBatchTexts = [...batchTexts];
                      newBatchTexts[index] = newText;
                      setBatchTexts(newBatchTexts);
                      // 에러 상태 해제
                      if (hasError && newText.trim()) {
                        setErrorIndex(null);
                      }
                    }}
                    placeholder={hasError ? errorMessage : `${labelPrefix} ${index + 1}`}
                    placeholderTextColor={hasError ? '#ff3b30' : MANDALART_COLORS.common.textMuted}
                    maxLength={50}
                    returnKeyType="next"
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.batchButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, styles.batchSaveButton]}
            onPress={handleBatchSave}
            accessibilityRole="button"
            accessibilityLabel={t.common.save}
          >
            <Text style={styles.saveButtonText}>{t.common.save}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderSingleInput = () => (
    <>
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
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={Platform.OS === 'android' ? 'none' : 'fade'}
      onRequestClose={onClose}
      hardwareAccelerated={Platform.OS === 'android'}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoid}
        >
          <View
            style={[
              styles.modalContainer,
              isBatchMode && styles.batchModalContainer,
            ]}
          >
            <View style={[styles.header, { backgroundColor: colors.bg }]}>
              <Text style={styles.title}>
                {isBatchMode ? getBatchTitle() : getTitle()}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.content, isBatchMode && styles.batchContent]}>
              {isBatchMode ? renderBatchInputs() : renderSingleInput()}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    ...Platform.select({
      web: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      default: {},
    }),
  },
  backdrop: {
    flex: 1,
  },
  keyboardAvoid: {
    ...Platform.select({
      web: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      default: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
      },
    }),
  },
  modalContainer: {
    backgroundColor: Platform.OS === 'android' ? '#F2F2F7' : 'rgba(242, 242, 247, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: Platform.OS === 'web' ? 24 : 0,
    borderBottomRightRadius: Platform.OS === 'web' ? 24 : 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderWidth: Platform.OS === 'android' ? 0 : 1.5,
    borderColor: Platform.OS === 'android' ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
    ...Platform.select({
      android: {
        // Android에서는 elevation + clipping 조합이 입력 포커스 시 깜빡임을 유발할 수 있음
        elevation: 0,
        shadowOpacity: 0,
      },
      web: {
        maxHeight: 650,
        borderRadius: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        borderBottomWidth: 1.5,
        position: 'relative' as const,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 400,
      },
      default: {},
    }),
  },
  batchModalContainer: {
    height: Platform.OS === 'web' ? undefined : '78%',
    maxHeight: Platform.OS === 'web' ? 650 : undefined,
    minHeight: Platform.OS === 'web' ? undefined : 480,
    ...Platform.select({
      ios: {
        paddingBottom: 40,
      },
      android: {
        paddingBottom: 10,
      },
      default: {},
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: Platform.OS === 'android' ? '#EDEDF2' : 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    backgroundColor: Platform.OS === 'android' ? '#E4E4E8' : 'rgba(240, 240, 242, 0.8)',
    borderWidth: Platform.OS === 'android' ? 0 : 1,
    borderColor: Platform.OS === 'android' ? 'transparent' : 'rgba(255, 255, 255, 0.6)',
    ...Platform.select({
      android: {
        elevation: 0,
        shadowOpacity: 0,
      },
      default: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  closeText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  batchContent: {
    paddingBottom: 0,
    flex: 1,
    minHeight: 0,
  },
  input: {
    backgroundColor: Platform.OS === 'android' ? '#FFFFFF' : 'rgba(240, 240, 242, 0.8)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Platform.OS === 'android' ? '#D8D8DE' : 'rgba(255, 255, 255, 0.6)',
    ...Platform.select({
      android: {
        elevation: 0,
        shadowOpacity: 0,
      },
      default: {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 2,
      },
    }),
    outlineStyle: 'none' as any,
  },
  batchContainer: {
    flex: 1,
    minHeight: 0,
    maxHeight: Platform.OS === 'web' ? 500 : undefined,
  },
  batchScrollView: {
    flex: 1,
    minHeight: 0,
    maxHeight: Platform.OS === 'web' ? 400 : undefined,
  },
  batchScrollContent: {
    paddingBottom: 16,
  },
  batchButtonContainer: {
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 14,
    borderTopWidth: 1,
    borderTopColor: Platform.OS === 'android' ? '#DBDBE2' : 'rgba(255, 255, 255, 0.7)',
    backgroundColor: Platform.OS === 'android' ? '#F2F2F7' : 'rgba(242, 242, 247, 0.96)',
  },
  batchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  batchInputLabel: {
    width: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  batchInput: {
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? '#FFFFFF' : 'rgba(240, 240, 242, 0.8)',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: Platform.OS === 'android' ? '#D8D8DE' : 'rgba(255, 255, 255, 0.6)',
    outlineStyle: 'none' as any,
  },
  batchInputError: {
    borderColor: '#ff3b30',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  batchInputLabelError: {
    color: '#ff3b30',
  },
  saveButton: {
    borderRadius: 99,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Platform.OS === 'android' ? '#E4E4E8' : 'rgba(255, 255, 255, 0.25)',
    borderWidth: Platform.OS === 'android' ? 1 : 2,
    borderTopColor: Platform.OS === 'android' ? '#CCCCD4' : 'rgba(255, 255, 255, 0.95)',
    borderLeftColor: Platform.OS === 'android' ? '#CCCCD4' : 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: Platform.OS === 'android' ? '#CCCCD4' : 'rgba(255, 255, 255, 0.3)',
    borderRightColor: Platform.OS === 'android' ? '#CCCCD4' : 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      android: {
        elevation: 0,
        shadowOpacity: 0,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  batchSaveButton: {
    marginTop: 6,
    marginBottom: 0,
  },
  saveButtonText: {
    color: '#222',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
