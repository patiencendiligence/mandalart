import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MANDALART_COLORS } from '../utils/colors';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function InfoModal({ visible, onClose }: InfoModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>만다라트(Mandalart)</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📖 유래</Text>
            <Text style={styles.sectionText}>
              만다라트는 일본의 프로 야구 선수 오타니 쇼헤이가 고안한 목표 달성 기법입니다. 
              "Mandala"와 "Art"를 합친 이름으로, 9×9 그리드 형태의 구조를 통해 
              목표를 체계적으로 분해하고 관리합니다.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 사용 방법</Text>
            
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1. 메인 목표 설정</Text>
              <Text style={styles.stepText}>
                중앙의 큰 칸에 달성하고 싶은 최종 목표를 입력합니다.
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>2. 8개의 세부 목표 작성</Text>
              <Text style={styles.stepText}>
                메인 목표 주변의 8개 칸에 메인 목표를 달성하기 위한 세부 목표들을 작성합니다.
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>3. 액션 아이템 분해</Text>
              <Text style={styles.stepText}>
                각 세부 목표를 클릭하여, 그 세부 목표를 달성하기 위한 
                구체적인 8개의 액션 아이템을 입력합니다.
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>4. 진행 상황 추적</Text>
              <Text style={styles.stepText}>
                완료한 액션 아이템을 체크하여 진행 상황을 시각적으로 추적합니다.
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>5. 주기적 검토</Text>
              <Text style={styles.stepText}>
                월간/연간으로 목표를 전환하여 다양한 시간 단위의 목표를 관리합니다.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 팁</Text>
            <Text style={styles.tipText}>
              • 세부 목표는 메인 목표를 달성하기 위한 핵심 영역들이어야 합니다.
            </Text>
            <Text style={styles.tipText}>
              • 각 액션 아이템은 구체적이고 실행 가능해야 합니다.
            </Text>
            <Text style={styles.tipText}>
              • 정기적으로 진행 상황을 확인하고 목표를 조정합니다.
            </Text>
            <Text style={styles.tipText}>
              • 한 달에 한 번씩 월간 목표를 검토하고 새로운 목표를 설정하세요.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MANDALART_COLORS.common.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MANDALART_COLORS.common.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MANDALART_COLORS.common.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: MANDALART_COLORS.common.textMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MANDALART_COLORS.common.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: MANDALART_COLORS.common.textMuted,
  },
  step: {
    marginBottom: 16,
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: MANDALART_COLORS.main.text,
    marginBottom: 6,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 22,
    color: MANDALART_COLORS.common.textMuted,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
    color: MANDALART_COLORS.common.textMuted,
    marginBottom: 8,
    marginLeft: 8,
  },
});
