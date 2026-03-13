import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MandalartData } from '../types/mandalart';
import { useTranslation } from '../i18n';

interface ExpiryWarningModalProps {
  visible: boolean;
  expiringData: MandalartData[];
  onClose: () => void;
  onDownloadAll?: () => void;
}

export function ExpiryWarningModal({
  visible,
  expiringData,
  onClose,
}: ExpiryWarningModalProps) {
  const { t, formatText, getMonthName, language } = useTranslation();

  const formatDataInfo = (data: MandalartData) => {
    if (data.period === 'yearly') {
      return formatText(t.expiryWarningModal.yearlyGoal, { year: data.year });
    }
    return language === 'ko'
      ? formatText(t.expiryWarningModal.monthlyGoal, { year: data.year, month: data.month || 1 })
      : formatText(t.expiryWarningModal.monthlyGoal, { year: data.year, month: getMonthName(data.month || 1) });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.title}>{t.expiryWarningModal.title}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>
              {t.expiryWarningModal.description}
            </Text>

            <ScrollView style={styles.dataList} showsVerticalScrollIndicator={false}>
              {expiringData.map((data, index) => (
                <View key={data.id} style={styles.dataItem}>
                  <Text style={styles.dataItemText}>
                    • {formatDataInfo(data)}
                  </Text>
                  {data.mainGoal && (
                    <Text style={styles.dataItemGoal} numberOfLines={1}>
                      "{data.mainGoal}"
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <Text style={styles.notice}>
              {t.expiryWarningModal.notice}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t.common.confirm}
          >
            <Text style={styles.closeButtonText}>{t.common.confirm}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    width: '90%',
    maxWidth: 360,
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    gap: 8,
  },
  warningIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  dataList: {
    maxHeight: 180,
    backgroundColor: 'rgba(187, 187, 188, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  dataItem: {
    marginBottom: 10,
  },
  dataItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dataItemGoal: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    marginLeft: 12,
  },
  notice: {
    fontSize: 12,
    color: '#007aff',
    lineHeight: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 8,
    padding: 10,
  },
  closeButton: {
    margin: 16,
    marginTop: 0,
    paddingVertical: 14,
    backgroundColor: '#007aff',
    borderRadius: 99,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
