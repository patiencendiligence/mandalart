import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getPastMandalarts, deletePastMandalarts } from '../storage/mandalartStorage';
import { useI18n, useTranslation, Language } from '../i18n';

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

    const confirmDelete = () => {
      setIsDeleting(true);
      deletePastMandalarts()
        .then((count) => {
          setPastDataCount(0);
          const message = formatText(t.settingsModal.deleteCompleteMessage, { count });
          if (Platform.OS === 'web') {
            alert(message);
          } else {
            Alert.alert(t.settingsModal.deleteComplete, message);
          }
          onDataDeleted?.();
        })
        .finally(() => {
          setIsDeleting(false);
        });
    };

    const confirmMessage = formatText(t.settingsModal.deleteConfirmMessage, { count: pastDataCount });

    if (Platform.OS === 'web') {
      if (confirm(confirmMessage)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        t.settingsModal.deleteConfirmTitle,
        confirmMessage,
        [
          { text: t.common.cancel, style: 'cancel' },
          { text: t.common.delete, style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  }, [pastDataCount, onDataDeleted, t, formatText]);

  const handleSelectImage = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      // iOS/Android: expo-image-picker 사용
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t.settingsModal.permissionRequired || '권한 필요',
          t.settingsModal.permissionMessage || '이미지를 선택하려면 갤러리 접근 권한이 필요합니다.',
          [{ text: t.common.ok || '확인' }]
        );
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
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    width: '90%',
    maxWidth: 360,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
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
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
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
    color: '#333',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  previewContainer: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'rgba(187, 187, 188, 0.1)',
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
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
    borderRadius: 12,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#007aff',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  selectButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#007aff',
    borderRadius: 99,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  removeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
    borderRadius: 99,
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff3b30',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(187, 187, 188, 0.2)',
    marginVertical: 20,
  },
  deleteButton: {
    paddingVertical: 12,
    backgroundColor: '#ff3b30',
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  deleteButtonDisabled: {
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButtonTextDisabled: {
    color: '#999',
  },
});
