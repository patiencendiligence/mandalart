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

  const periodText = period === 'yearly' ? `${year}년` : `${year}년 ${month}월`;
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
                <Text style={styles.periodText}>{periodText}에 나는</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="'무엇'을 할거야?"
                    placeholderTextColor={MANDALART_COLORS.common.textSecondary}
                    value={mainGoal}
                    onChangeText={setMainGoal}
                    maxLength={50}
                  />
                </View>
                <Text style={styles.charCount}>{mainGoal.length}/50</Text>
                <TouchableOpacity 
                  style={[styles.button, !isButtonEnabled && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={0.9}
                  disabled={!isButtonEnabled}
                  accessibilityRole="button"
                  accessibilityLabel="시작"
                >
                  <Text style={[styles.buttonText, !isButtonEnabled && styles.buttonTextDisabled]}>시작</Text>
                </TouchableOpacity>
              </View>
            {onClose && (
              <TouchableOpacity 
                style={styles.closeIconButton} 
                onPress={onClose} 
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="닫기"
              >
                <Text style={styles.closeIconText}>×</Text>
              </TouchableOpacity>
            )}
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const CIRCLE_SIZE = 250;

const styles = StyleSheet.create({
    closeIconButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
      width: 28,
      height: 28,
      borderRadius: 99,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0,
    },
    closeIconText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 18,
      textAlign: 'center',
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
    borderWidth: 0,
    backgroundColor: 'rgba(187, 187, 188, 0.08)',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(187, 187, 188, 0.12)',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
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
    marginBottom: 2,
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
    height: 28,
    textAlign: 'center',
    color: '#2a3a4a',
    fontSize: 14,
    fontWeight: '600',
    padding: 2,
    marginBottom: 4,
  },
  charCount: {
    color: '#8a9aaa',
    fontSize: 10,
    marginBottom: 6,
  },
  button: {
    width: '85%',
    paddingVertical: 10,
    borderRadius: 99,
    backgroundColor: '#007aff',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: { 
    opacity: 0.4,
    backgroundColor: 'rgba(187, 187, 188, 0.3)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  buttonTextDisabled: { opacity: 0.7 },
});
        


  
