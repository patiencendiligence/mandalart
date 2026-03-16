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
  const inputRef = useRef<TextInput>(null);
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
    
    const nonEmptyTexts = batchTexts.filter(t => t.trim());
    if (nonEmptyTexts.length === 0) return;

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
    
    return (
      <ScrollView style={styles.batchScrollView} showsVerticalScrollIndicator={false}>
        {batchTexts.map((value, index) => (
          <View key={index} style={styles.batchInputRow}>
            <Text style={styles.batchInputLabel}>{index + 1}</Text>
            <TextInput
              style={styles.batchInput}
              value={value}
              onChangeText={(newText) => {
                const newBatchTexts = [...batchTexts];
                newBatchTexts[index] = newText;
                setBatchTexts(newBatchTexts);
              }}
              placeholder={`${labelPrefix} ${index + 1}`}
              placeholderTextColor={MANDALART_COLORS.common.textMuted}
              maxLength={50}
              returnKeyType="next"
            />
          </View>
        ))}
        <TouchableOpacity
          style={[styles.saveButton, styles.batchSaveButton]}
          onPress={handleBatchSave}
          accessibilityRole="button"
          accessibilityLabel={t.common.save}
        >
          <Text style={styles.saveButtonText}>{t.common.save}</Text>
        </TouchableOpacity>
      </ScrollView>
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
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <View style={[styles.modalContainer, isBatchMode && styles.batchModalContainer]}>
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
  },
  backdrop: {
    flex: 1,
  },
  keyboardAvoid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    backgroundColor: 'rgba(242, 242, 247, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  batchModalContainer: {
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    backgroundColor: 'rgba(240, 240, 242, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
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
  batchContent: {
    paddingBottom: 10,
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    outlineStyle: 'none' as any,
  },
  batchScrollView: {
    maxHeight: 400,
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
    backgroundColor: 'rgba(240, 240, 242, 0.8)',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    outlineStyle: 'none' as any,
  },
  saveButton: {
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(240, 240, 242, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  batchSaveButton: {
    marginTop: 16,
    marginBottom: 10,
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
  },
  saveButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
});
