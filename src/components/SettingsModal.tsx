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
import { getPastMandalarts, deletePastMandalarts } from '../storage/mandalartStorage';

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

  useEffect(() => {
    if (visible) {
      loadPastDataCount();
    }
  }, [visible]);

  const loadPastDataCount = async () => {
    const pastData = await getPastMandalarts();
    setPastDataCount(pastData.length);
  };

  const handleDeletePastData = useCallback(() => {
    if (pastDataCount === 0) return;

    const confirmDelete = () => {
      setIsDeleting(true);
      deletePastMandalarts()
        .then((count) => {
          setPastDataCount(0);
          if (Platform.OS === 'web') {
            alert(`${count}개의 지난 데이터가 삭제되었습니다.`);
          } else {
            Alert.alert('삭제 완료', `${count}개의 지난 데이터가 삭제되었습니다.`);
          }
          onDataDeleted?.();
        })
        .finally(() => {
          setIsDeleting(false);
        });
    };

    if (Platform.OS === 'web') {
      if (confirm(`당월 이전의 모든 데이터(${pastDataCount}개)를 삭제하시겠습니까?\n\n삭제된 데이터는 복구할 수 없습니다.`)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        '지난 데이터 삭제',
        `당월 이전의 모든 데이터(${pastDataCount}개)를 삭제하시겠습니까?\n\n삭제된 데이터는 복구할 수 없습니다.`,
        [
          { text: '취소', style: 'cancel' },
          { text: '삭제', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  }, [pastDataCount, onDataDeleted]);

  const handleSelectImage = () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
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
            <Text style={styles.title}>설정</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="닫기"
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>배경 이미지</Text>
            <Text style={styles.sectionDesc}>
              나만의 배경 이미지를 설정하세요
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
                accessibilityLabel="이미지 선택"
              >
                <Text style={styles.selectButtonText}>
                  {backgroundImage ? '이미지 변경' : '이미지 선택'}
                </Text>
              </TouchableOpacity>

              {backgroundImage && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemoveImage}
                  accessibilityRole="button"
                  accessibilityLabel="이미지 제거"
                >
                  <Text style={styles.removeButtonText}>제거</Text>
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
            
            <Text style={styles.sectionTitle}>데이터 관리</Text>
            <Text style={styles.sectionDesc}>
              당월 이전의 모든 만다라트 데이터를 삭제합니다.{'\n'}
              (데이터는 2년 후 자동 삭제됩니다)
            </Text>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                pastDataCount === 0 && styles.deleteButtonDisabled,
              ]}
              onPress={handleDeletePastData}
              disabled={pastDataCount === 0 || isDeleting}
              accessibilityRole="button"
              accessibilityLabel="지난 데이터 삭제"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[
                  styles.deleteButtonText,
                  pastDataCount === 0 && styles.deleteButtonTextDisabled,
                ]}>
                  🗑️ 지난 데이터 삭제 ({pastDataCount}개)
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
