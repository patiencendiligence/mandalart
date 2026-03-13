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
import { useTranslation } from '../i18n';


interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function InfoModal({ visible, onClose }: InfoModalProps) {
  const { t } = useTranslation();
  
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.infoModal.title}</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t.common.close}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.infoModal.origin}</Text>
            <Text style={styles.sectionText}>
              {t.infoModal.originText}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.infoModal.howToUse}</Text>
            
            <View style={styles.step}>
              <Text style={styles.stepNumber}>{t.infoModal.step1Title}</Text>
              <Text style={styles.stepText}>
                {t.infoModal.step1Text}
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>{t.infoModal.step2Title}</Text>
              <Text style={styles.stepText}>
                {t.infoModal.step2Text}
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>{t.infoModal.step3Title}</Text>
              <Text style={styles.stepText}>
                {t.infoModal.step3Text}
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>{t.infoModal.step4Title}</Text>
              <Text style={styles.stepText}>
                {t.infoModal.step4Text}
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>{t.infoModal.step5Title}</Text>
              <Text style={styles.stepText}>
                {t.infoModal.step5Text}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.infoModal.tips}</Text>
            <Text style={styles.tipText}>{t.infoModal.tip1}</Text>
            <Text style={styles.tipText}>{t.infoModal.tip2}</Text>
            <Text style={styles.tipText}>{t.infoModal.tip3}</Text>
            <Text style={styles.tipText}>{t.infoModal.tip4}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
    borderRadius: 99,
    borderWidth: 0,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'rgba(187, 187, 188, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a3a4a',
    marginBottom: 14,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#5a6a7a',
  },
  step: {
    marginBottom: 16,
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3498db',
    marginBottom: 6,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5a6a7a',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5a6a7a',
    marginBottom: 8,
    marginLeft: 8,
  },
});
