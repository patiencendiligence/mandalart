import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getPastMandalarts, deletePastMandalarts } from '../storage/mandalartStorage';
import { useI18n, useTranslation, Language } from '../i18n';
import { AlertModal } from './AlertModal';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  backgroundImage: string | null;
  onImageSelect: (imageUri: string | null) => void;
  onDataDeleted?: () => void;
}

export function SettingsModal({
  visible,
  onClose,
  backgroundImage,
  onImageSelect,
  onDataDeleted,
}: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pastDataCount, setPastDataCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { language, setLanguage } = useI18n();
  const { t, formatText } = useTranslation();
  
  // Alert modal states
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPastDataCount();
    }
  }, [visible]);

  const loadPastDataCount = async () => {
    const pastData = await getPastMandalarts();
    setPastDataCount(pastData.length);
  };

  const handleLanguageChange = useCallback(async (lang: Language) => {
    await setLanguage(lang);
  }, [setLanguage]);

  const handleDeletePastData = useCallback(() => {
    if (pastDataCount === 0) return;
    setConfirmModalVisible(true);
  }, [pastDataCount]);

  const confirmDelete = useCallback(() => {
    setConfirmModalVisible(false);
    setIsDeleting(true);
    deletePastMandalarts()
      .then((count) => {
        setPastDataCount(0);
        const message = formatText(t.settingsModal.deleteCompleteMessage, { count });
        setSuccessMessage(message);
        setSuccessModalVisible(true);
        onDataDeleted?.();
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }, [t, formatText, onDataDeleted]);

  const handleSelectImage = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      // iOS/Android: expo-image-picker 사용
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setPermissionModalVisible(true);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelect(result.assets[0].uri);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageSelect(null);
  };

  return (
    <>
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.settingsModal.title}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t.common.close}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* 언어 설정 섹션 */}
            <Text style={styles.sectionTitle}>{t.settingsModal.language}</Text>
            <Text style={styles.sectionDesc}>
              {t.settingsModal.languageDesc}
            </Text>

            <View style={styles.languageButtonRow}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'ko' && styles.languageButtonActive,
                ]}
                onPress={() => handleLanguageChange('ko')}
                accessibilityRole="button"
                accessibilityLabel="한국어"
              >
                <Text style={[
                  styles.languageButtonText,
                  language === 'ko' && styles.languageButtonTextActive,
                ]}>
                  🇰🇷 한국어
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'en' && styles.languageButtonActive,
                ]}
                onPress={() => handleLanguageChange('en')}
                accessibilityRole="button"
                accessibilityLabel="English"
              >
                <Text style={[
                  styles.languageButtonText,
                  language === 'en' && styles.languageButtonTextActive,
                ]}>
                  🇺🇸 English
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* 배경 이미지 섹션 */}
            <Text style={styles.sectionTitle}>{t.settingsModal.backgroundImage}</Text>
            <Text style={styles.sectionDesc}>
              {t.settingsModal.backgroundImageDesc}
            </Text>

            {backgroundImage && (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: backgroundImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectImage}
                accessibilityRole="button"
                accessibilityLabel={t.settingsModal.selectImage}
              >
                <Text style={styles.selectButtonText}>
                  {backgroundImage ? t.settingsModal.changeImage : t.settingsModal.selectImage}
                </Text>
              </TouchableOpacity>

              {backgroundImage && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemoveImage}
                  accessibilityRole="button"
                  accessibilityLabel={t.settingsModal.removeImage}
                >
                  <Text style={styles.removeButtonText}>{t.settingsModal.removeImage}</Text>
                </TouchableOpacity>
              )}
            </View>

            {Platform.OS === 'web' && (
              <input
                ref={fileInputRef as any}
                type="file"
                accept="image/*"
                onChange={handleFileChange as any}
                style={{ display: 'none' }}
              />
            )}

            {/* 데이터 관리 섹션 */}
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>{t.settingsModal.dataManagement}</Text>
            <Text style={styles.sectionDesc}>
              {t.settingsModal.dataManagementDesc}
            </Text>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                pastDataCount === 0 && styles.deleteButtonDisabled,
              ]}
              onPress={handleDeletePastData}
              disabled={pastDataCount === 0 || isDeleting}
              accessibilityRole="button"
              accessibilityLabel={t.settingsModal.deletePastData}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[
                  styles.deleteButtonText,
                  pastDataCount === 0 && styles.deleteButtonTextDisabled,
                ]}>
                  {formatText(t.settingsModal.deletePastDataButton, { count: pastDataCount })}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* 삭제 확인 모달 */}
    <AlertModal
      visible={confirmModalVisible}
      title={t.settingsModal.deleteConfirmTitle || '데이터 삭제'}
      message={formatText(t.settingsModal.deleteConfirmMessage, { count: pastDataCount })}
      buttons={[
        { text: t.common.cancel || '취소', style: 'cancel' },
        { text: t.common.delete || '삭제', style: 'default', onPress: confirmDelete },
      ]}
      onClose={() => setConfirmModalVisible(false)}
    />

    {/* 삭제 완료 모달 */}
    <AlertModal
      visible={successModalVisible}
      title={t.settingsModal.deleteComplete || '삭제 완료'}
      message={successMessage}
      buttons={[{ text: t.common.confirm || '확인', style: 'default' }]}
      onClose={() => setSuccessModalVisible(false)}
    />

    {/* 권한 필요 모달 */}
    <AlertModal
      visible={permissionModalVisible}
      title={t.settingsModal.permissionRequired || '권한 필요'}
      message={t.settingsModal.permissionMessage || '이미지를 선택하려면 갤러리 접근 권한이 필요합니다.'}
      buttons={[{ text: t.common.confirm || '확인', style: 'default' }]}
      onClose={() => setPermissionModalVisible(false)}
    />
    </>
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
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 24,
    width: '90%',
    maxWidth: 360,
    overflow: 'hidden',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  closeText: {
    fontSize: 20,
    color: '#666',
    lineHeight: 22,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
    marginBottom: 16,
  },
  previewContainer: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 12,
    alignItems: 'center',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
  },
  languageButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // Liquid glass border
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  languageButtonTextActive: {
    color: '#222',
  },
  selectButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 99,
    alignItems: 'center',
    // Liquid glass border
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  removeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 99,
    alignItems: 'center',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(120, 120, 128, 0.15)',
    marginVertical: 20,
  },
  deleteButton: {
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    // Liquid glass border
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  deleteButtonDisabled: {
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    shadowOpacity: 0,
    elevation: 0,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  deleteButtonTextDisabled: {
    color: '#999',
  },
});
