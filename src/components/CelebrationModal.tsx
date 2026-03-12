import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { MANDALART_COLORS } from '../utils/colors';
import { REFLECTION_EMOJIS, Reflection } from '../types/mandalart';

interface CelebrationModalProps {
  visible: boolean;
  year: number;
  month: number;
  onSave: (reflection: Reflection) => void;
}

export function CelebrationModal({
  visible,
  year,
  month,
  onSave,
}: CelebrationModalProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [reflectionText, setReflectionText] = useState('');
  
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSelectedEmoji('');
      setReflectionText('');
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  const canSave = selectedEmoji !== '' && reflectionText.trim().length > 0;

  const handleSave = () => {
    if (canSave) {
      onSave({
        emoji: selectedEmoji,
        text: reflectionText.trim(),
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.celebrationIcon}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
          </View>
          
          <Text style={styles.title}>축하합니다!</Text>
          <Text style={styles.subtitle}>
            {year}년 {month}월 목표를 모두 달성했어요!
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>이번 달을 평가해주세요</Text>
            <View style={styles.emojiContainer}>
              {REFLECTION_EMOJIS.map((item) => (
                <TouchableOpacity
                  key={item.emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === item.emoji && styles.emojiButtonSelected,
                  ]}
                  onPress={() => setSelectedEmoji(item.emoji)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected: selectedEmoji === item.emoji }}
                >
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={[
                    styles.emojiLabel,
                    selectedEmoji === item.emoji && styles.emojiLabelSelected,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>간단한 회고를 남겨주세요</Text>
            <TextInput
              style={styles.textInput}
              value={reflectionText}
              onChangeText={(text) => setReflectionText(text.slice(0, 15))}
              placeholder="15자 이내로 작성"
              placeholderTextColor={MANDALART_COLORS.common.textSecondary}
              maxLength={15}
            />
            <Text style={styles.charCount}>{reflectionText.length}/15</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              !canSave && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel="저장"
            accessibilityState={{ disabled: !canSave }}
          >
            <Text style={[
              styles.saveButtonText,
              !canSave && styles.saveButtonTextDisabled,
            ]}>
              저장
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
  },
  celebrationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 204, 0, 0.15)',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  celebrationEmoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#5d6d7e',
    marginBottom: 28,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5d6d7e',
    marginBottom: 14,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    flexWrap: 'nowrap',
  },
  emojiButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    flex: 1,
    backgroundColor: 'rgba(187, 187, 188, 0.1)',
    borderWidth: 0,
  },
  emojiButtonSelected: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
  },
  emoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 9,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  emojiLabelSelected: {
    color: '#27ae60',
    fontWeight: '700',
  },
  textInput: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(187, 187, 188, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 0,
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  saveButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#34c759',
    borderRadius: 99,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(187, 187, 188, 0.2)',
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  saveButtonTextDisabled: {
    color: 'rgba(100, 110, 120, 0.6)',
  },
});
