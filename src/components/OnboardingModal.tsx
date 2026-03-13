import  { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { MANDALART_COLORS } from '../utils/colors';
import { useTranslation } from '../i18n';
import React from 'react';

interface OnboardingModalProps {
  visible: boolean;
  period: 'monthly' | 'yearly';
  year: number;
  month: number;
  onSubmit: (mainGoal: string) => void;
  onClose?: () => void;
}

export function OnboardingModal({
  visible,
  period,
  year,
  month,
  onSubmit,
  onClose,
}: OnboardingModalProps) {
  const [mainGoal, setMainGoal] = useState('');
  const pressScale = useRef(new Animated.Value(1)).current;
  const { t, formatText, getMonthName, language } = useTranslation();

  const RIPPLE_COUNT = 3;
  const rippleAnimsRef = useRef<Animated.Value[]>(
    Array.from({ length: RIPPLE_COUNT }, () => new Animated.Value(0)),
  );
  const rippleLoopsRef = useRef<Array<Animated.CompositeAnimation | null>>(Array(RIPPLE_COUNT).fill(null));
  const rippleTimersRef = useRef<Array<any>>(Array(RIPPLE_COUNT).fill(null));

  useEffect(() => {
    if (!visible) {
      rippleLoopsRef.current.forEach((l) => l && l.stop());
      rippleTimersRef.current.forEach((t) => t && clearTimeout(t));
      rippleAnimsRef.current.forEach((v) => v.setValue(0));
      return;
    }

    rippleAnimsRef.current.forEach((anim, i) => {
      anim.setValue(0);
      const loop = Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      rippleLoopsRef.current[i] = loop;
      const timer = setTimeout(() => {
        loop.start();
      }, i * 500);
      rippleTimersRef.current[i] = timer;
    });

    return () => {
      rippleLoopsRef.current.forEach((l) => l && l.stop());
      rippleTimersRef.current.forEach((t) => t && clearTimeout(t));
    };
  }, [visible]);

  const periodText = period === 'yearly' 
    ? formatText(t.onboarding.periodYearly, { year }) 
    : (language === 'ko' 
        ? formatText(t.onboarding.periodMonthly, { year, month }) 
        : formatText(t.onboarding.periodMonthly, { year, month: getMonthName(month) }));
  const isButtonEnabled = mainGoal.trim().length > 0;

  const handleSubmit = () => {
    if (!isButtonEnabled) return;
    onSubmit(mainGoal.trim());
    setMainGoal('');
  };

  const handlePressIn = () => Animated.spring(pressScale, { toValue: 1.1, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Modal visible={visible} transparent animationType="fade" >
      <SafeAreaView style={styles.modalBackdrop} pointerEvents="box-none">
        <View style={styles.centerWrap}>
          <View style={styles.circleContainer}>
            {rippleAnimsRef.current.map((anim, i) => (
              <Animated.View
                key={`ripple-${i}`}
                pointerEvents="none"
                style={[
                  styles.ripple,
                  i > 0 && { borderWidth: 2 + i },
                  {
                    transform: [
                      {
                        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }),
                      },
                    ],
                    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }),
                  },
                ]}
              />
            ))}

            <Animated.View style={[styles.circle, { transform: [{ scale: pressScale }], pointerEvents: 'auto' }]}> 
              <View style={styles.circleTouchable}>
                <Text style={styles.periodText}>{periodText}{t.onboarding.suffix}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={t.onboarding.placeholder}
                    placeholderTextColor={MANDALART_COLORS.common.textSecondary}
                    value={mainGoal}
                    onChangeText={setMainGoal}
                    maxLength={50}
                  />
                </View>
                <Text style={styles.charCount}>{mainGoal.length}/50</Text>
                <View style={styles.buttonRow}>
                  {onClose && (
                    <TouchableOpacity 
                      style={styles.cancelButton} 
                      onPress={onClose} 
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={t.common.close}
                    >
                      <Text style={styles.cancelButtonText}>{t.common.close}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.submitButton, !isButtonEnabled && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.9}
                    disabled={!isButtonEnabled}
                    accessibilityRole="button"
                    accessibilityLabel={t.onboarding.start}
                  >
                    <Text style={[styles.buttonText, !isButtonEnabled && styles.buttonTextDisabled]}>{t.onboarding.start}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const CIRCLE_SIZE = 300;

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    width: '85%',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 99,
    // Liquid glass 스타일 (어두운 버전)
    backgroundColor: 'rgba(160, 160, 165, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#444',
    fontSize: 12,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#e8e8e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrap: {
    width: '100%',
    alignItems: 'center',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    // Liquid glass 배경
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    // Liquid glass border
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  circleTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  periodText: {
    color: '#2a3a4a',
    textTransform: 'uppercase',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '600',
  },
  smallHint: {
    color: '#5a6a7a',
    fontSize: 12,
    marginBottom: 6,
  },
  inputWrapper: {
    width: '85%',
    zIndex: 2,
  },
  input: {
    width: '100%',
    height: 62,
    textAlign: 'center',
    color: '#2a3a4a',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 4,
    // Liquid glass 스타일
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    // 웹에서 포커스 시 파란 outline 제거
    outlineStyle: 'none' as any,
  },
  charCount: {
    color: '#8a9aaa',
    fontSize: 10,
    marginBottom: 6,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 99,
    // Liquid glass 스타일
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: { 
    opacity: 0.5,
    backgroundColor: 'rgba(200, 200, 205, 0.4)',
  },
  buttonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '700',
  },
  buttonTextDisabled: { 
    opacity: 0.6,
    color: '#666',
  },
});
        


  
