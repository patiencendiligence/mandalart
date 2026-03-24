import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MandalartGrid } from '../components/MandalartGrid';
import { EditModal } from '../components/EditModal';
import { DetailModal } from '../components/DetailModal';
import { InfoModal } from '../components/InfoModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { PeriodSelector } from '../components/PeriodSelector';
import { CelebrationModal } from '../components/CelebrationModal';
import { MandalartImageExport } from '../components/MandalartImageExport';
import { SettingsModal } from '../components/SettingsModal';
import { ExpiryWarningModal } from '../components/ExpiryWarningModal';
import { AlertModal } from '../components/AlertModal';
import { useMandalart } from '../hooks/useMandalart';
import { SelectedCell, Reflection, MandalartData } from '../types/mandalart';
import { MANDALART_COLORS } from '../utils/colors';
import {
  getExpiringMandalarts,
  deleteExpiredMandalarts,
  shouldShowExpiryWarning,
  markWarningShown,
} from '../storage/mandalartStorage';
import { useTranslation } from '../i18n';

const BACKGROUND_IMAGE_KEY = 'mandalart_background_image';

export function HomeScreen() {
  const { t, formatText, getMonthName, language } = useTranslation();

  // 기간 상태
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // 만다라트 데이터 훅
  const {
    data,
    loading,
    saving,
    updateMainGoal,
    updateSubGoal,
    updateAllSubGoals,
    updateAction,
    updateAllActions,
    toggleActionComplete,
    completeAllActions,
    saveReflection,
  } = useMandalart(period, year, period === 'monthly' ? month : undefined);

  // 모달 상태
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [celebrationModalVisible, setCelebrationModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCell>();
  const [selectedSubGoalIndex, setSelectedSubGoalIndex] = useState<number>(0);

  // 배경 이미지 상태
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // 만료 경고 모달 상태
  const [expiryWarningVisible, setExpiryWarningVisible] = useState(false);
  const [expiringData, setExpiringData] = useState<MandalartData[]>([]);

  // 커스텀 알림 모달 상태
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  // 배경 이미지 로드/저장
  useEffect(() => {
    const loadBackgroundImage = async () => {
      if (Platform.OS === 'web') {
        const saved = localStorage.getItem(BACKGROUND_IMAGE_KEY);
        if (saved) {
          setBackgroundImage(saved);
        }
        return;
      }

      try {
        const saved = await AsyncStorage.getItem(BACKGROUND_IMAGE_KEY);
        if (saved) {
          setBackgroundImage(saved);
        }
      } catch (error) {
        console.error('Failed to load background image:', error);
      }
    };

    loadBackgroundImage();
  }, []);

  // 앱 시작 시 만료 데이터 체크 및 처리
  useEffect(() => {
    const checkDataExpiry = async () => {
      // 1. 만료된 데이터 자동 삭제 (2년 경과)
      const deletedCount = await deleteExpiredMandalarts();
      if (deletedCount > 0) {
        console.log(`${deletedCount}개의 만료된 데이터가 자동 삭제되었습니다.`);
      }

      // 2. 만료 예정 데이터 경고 표시 (1개월 전)
      const shouldShow = await shouldShowExpiryWarning();
      if (shouldShow) {
        const expiring = await getExpiringMandalarts();
        if (expiring.length > 0) {
          setExpiringData(expiring);
          setExpiryWarningVisible(true);
        }
      }
    };

    checkDataExpiry();
  }, []);

  // 만료 경고 모달 닫기
  const handleCloseExpiryWarning = useCallback(async () => {
    setExpiryWarningVisible(false);
    await markWarningShown();
  }, []);

  const handleBackgroundImageChange = useCallback(async (imageUri: string | null) => {
    setBackgroundImage(imageUri);
    if (Platform.OS === 'web') {
      if (imageUri) {
        localStorage.setItem(BACKGROUND_IMAGE_KEY, imageUri);
      } else {
        localStorage.removeItem(BACKGROUND_IMAGE_KEY);
      }
      return;
    }

    try {
      if (imageUri) {
        await AsyncStorage.setItem(BACKGROUND_IMAGE_KEY, imageUri);
      } else {
        await AsyncStorage.removeItem(BACKGROUND_IMAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save background image:', error);
    }
  }, []);
  
  // 완료 상태 추적 (축하 모달 중복 표시 방지)
  const prevAllCompletedRef = useRef(false);
  
  // 모든 세부목표 완료 여부 확인
  const isAllCompleted = data?.subGoals.every(subGoal => {
    const hasActions = subGoal.actions.some(a => a.text?.trim());
    return hasActions && subGoal.actions.every(a => a.completed);
  }) ?? false;
  
  // 완료 상태 변경 감지 및 축하 모달 표시
  useEffect(() => {
    if (isAllCompleted && !prevAllCompletedRef.current && !data?.reflection) {
      setCelebrationModalVisible(true);
    }
    prevAllCompletedRef.current = isAllCompleted;
  }, [isAllCompleted, data?.reflection]);

  // 목표가 없을 때 자동으로 온보딩 표시
  useEffect(() => {
    if (!loading && data && !data.mainGoal?.trim()) {
      setOnboardingVisible(true);
    }
  }, [loading, data, period, year, month]);

  // 셀 클릭 핸들러
  const handleCellPress = useCallback((
    type: 'main' | 'subGoal' | 'action',
    subGoalIndex: number,
    actionIndex?: number
  ) => {
    // 최종목표가 없는데 세부목표/실행계획 셀 클릭 시 경고
    if (type !== 'main' && !data?.mainGoal?.trim()) {
      setAlertModalVisible(true);
      return;
    }
    setSelectedCell({ type, subGoalIndex, actionIndex });
    setEditModalVisible(true);
  }, [data?.mainGoal]);

  // 세부목표 그리드 클릭 핸들러 (줌인)
  const handleSubGoalGridPress = useCallback((subGoalIndex: number) => {
    // 최종목표가 없으면 경고
    if (!data?.mainGoal?.trim()) {
      setAlertModalVisible(true);
      return;
    }
    setSelectedSubGoalIndex(subGoalIndex);
    setDetailModalVisible(true);
  }, [data?.mainGoal]);

  // EditModal이 DetailModal에서 열렸는지 추적
  const [openedFromDetail, setOpenedFromDetail] = useState(false);

  // 모달 닫기
  const handleCloseEditModal = useCallback(() => {
    setEditModalVisible(false);
    setSelectedCell(undefined);
    // DetailModal에서 열렸으면 다시 DetailModal 표시
    if (openedFromDetail) {
      setDetailModalVisible(true);
      setOpenedFromDetail(false);
    }
  }, [openedFromDetail]);

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalVisible(false);
  }, []);

  // 상세 모달에서 셀 클릭
  const handleDetailCellPress = useCallback((
    type: 'subGoal' | 'action',
    subGoalIndex: number,
    actionIndex?: number
  ) => {
    setSelectedCell({ type, subGoalIndex, actionIndex });
    setDetailModalVisible(false); // DetailModal 먼저 닫기
    setOpenedFromDetail(true);
    setEditModalVisible(true);
  }, []);

  // 저장 핸들러
  const handleSaveMain = useCallback(async (text: string) => {
    await updateMainGoal(text);
  }, [updateMainGoal]);

  const handleSaveSubGoal = useCallback(async (index: number, text: string) => {
    await updateSubGoal(index, text);
  }, [updateSubGoal]);

  const handleSaveAction = useCallback(async (
    subGoalIndex: number,
    actionIndex: number,
    text: string
  ) => {
    await updateAction(subGoalIndex, actionIndex, { text });
  }, [updateAction]);

  const handleToggleComplete = useCallback(async (
    subGoalIndex: number,
    actionIndex: number
  ) => {
    await toggleActionComplete(subGoalIndex, actionIndex);
  }, [toggleActionComplete]);

  const handleCompleteAllActions = useCallback(async (subGoalIndex: number) => {
    await completeAllActions(subGoalIndex);
  }, [completeAllActions]);

  // 세부목표 한번에 저장
  const handleSaveAllSubGoals = useCallback(async (texts: string[]) => {
    await updateAllSubGoals(texts);
  }, [updateAllSubGoals]);

  // 실행계획 한번에 저장
  const handleSaveAllActions = useCallback(async (subGoalIndex: number, texts: string[]) => {
    await updateAllActions(subGoalIndex, texts);
  }, [updateAllActions]);

  // 회고 저장 핸들러
  const handleSaveReflection = useCallback(async (reflection: Reflection) => {
    await saveReflection(reflection);
    setCelebrationModalVisible(false);
  }, [saveReflection]);

  // 이미지 다운로드 핸들러
  const handleDownloadImage = useCallback(() => {
    setExportModalVisible(true);
  }, []);

  // 목표 없을 때 온보딩 체크
  const hasMainGoal = data?.mainGoal && data.mainGoal.trim().length > 0;
  const shouldShowOnboarding = !loading && !hasMainGoal && !!onboardingVisible;

  const handleOnboardingSubmit = useCallback(async (mainGoal: string) => {
    await updateMainGoal(mainGoal);
  }, [updateMainGoal]);

  // 웹 전용 레이아웃 (크롬 확장프로그램 새 탭)
  const isWeb = Platform.OS === 'web';

  const mainContent = (
    <>
      {/* 헤더 */}
      <View style={[styles.header, isWeb && styles.webCentered]}>
        <Text style={styles.headerSubtitle}>
          {period === "yearly"
            ? formatText(t.homeScreen.yearlyGoal, { year })
            : (language === 'ko'
                ? formatText(t.homeScreen.monthlyGoal, { year, month })
                : formatText(t.homeScreen.monthlyGoal, { year, month: getMonthName(month) }))}
        </Text>
        {saving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator
              size="small"
              color={MANDALART_COLORS.common.success}
            />
            <Text style={styles.savingText}>{t.common.saving}</Text>
          </View>
        )}
      </View>

      {/* 기간 선택: 항상 렌더링 */}
      <View style={isWeb && styles.webCentered}>
        <PeriodSelector
          period={period}
          year={year}
          month={month}
          onPeriodChange={setPeriod}
          onYearChange={setYear}
          onMonthChange={setMonth}
          onInfoPress={() => setInfoModalVisible(true)}
          onSettingsPress={() => setSettingsModalVisible(true)}
        />
      </View>

      {/* 메인 그리드 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={MANDALART_COLORS.common.text}
          />
          <Text style={styles.loadingText}>{t.common.loading}</Text>
        </View>
      ) : !shouldShowOnboarding && data ? (
        <View style={[styles.gridWrapper, isWeb && styles.webCentered]}>
          <MandalartGrid
            data={data}
            onCellPress={handleCellPress}
            onSubGoalGridPress={handleSubGoalGridPress}
          />
          {/* 이미지 다운로드 버튼 (완료 시에만 표시) */}
          {isAllCompleted && data?.reflection && (
            <View style={styles.downloadButtonContainer}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadImage}
                accessibilityRole="button"
                accessibilityLabel={t.homeScreen.downloadImage}
              >
                <Text style={styles.downloadButtonText}>
                  {t.homeScreen.downloadImage}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : !shouldShowOnboarding ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t.common.error}</Text>
        </View>
      ) : (
        <View style={styles.emptyContainer} />
      )}
    </>
  );

  return (
    <>
      <OnboardingModal
        visible={shouldShowOnboarding}
        period={period}
        year={year}
        month={month}
        onSubmit={handleOnboardingSubmit}
        onClose={() => setOnboardingVisible(false)}
      />
      {isWeb ? (
        <ImageBackground
          source={backgroundImage ? { uri: backgroundImage } : undefined}
          style={styles.webBackgroundFull}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.webContainer}>
            <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
            />
            {mainContent}
          </SafeAreaView>
        </ImageBackground>
      ) : (
        <ImageBackground
          source={backgroundImage ? { uri: backgroundImage } : undefined}
          style={styles.backgroundContainer}
          resizeMode="cover"
        >
          <SafeAreaView
            style={[
              styles.container,
              backgroundImage && styles.containerTransparent,
            ]}
          >
            <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent={!!backgroundImage}
            />
            {mainContent}
          </SafeAreaView>
        </ImageBackground>
      )}

      {/* 상세 모달 (줌인 뷰) */}
      <DetailModal
        visible={detailModalVisible}
        subGoal={data?.subGoals[selectedSubGoalIndex] ?? null}
        subGoalIndex={selectedSubGoalIndex}
        onClose={handleCloseDetailModal}
        onCellPress={handleDetailCellPress}
        onCompleteAll={handleCompleteAllActions}
      />

      {/* 정보 모달 */}
      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />

      {/* 편집 모달 - 가장 마지막에 렌더링하여 최상위에 표시 */}
      <EditModal
        visible={editModalVisible}
        selectedCell={selectedCell}
        data={data}
        onClose={handleCloseEditModal}
        onSaveMain={handleSaveMain}
        onSaveSubGoal={handleSaveSubGoal}
        onSaveAction={handleSaveAction}
        onToggleComplete={handleToggleComplete}
        onSaveAllSubGoals={handleSaveAllSubGoals}
        onSaveAllActions={handleSaveAllActions}
      />

      {/* 축하 모달 - 모든 목표 완료 시 */}
      <CelebrationModal
        visible={celebrationModalVisible}
        year={year}
        month={month}
        onSave={handleSaveReflection}
      />

      {/* 이미지 내보내기 모달 */}
      {exportModalVisible && data && (
        <MandalartImageExport
          data={data}
          onClose={() => setExportModalVisible(false)}
          backgroundImage={backgroundImage}
        />
      )}

      {/* 설정 모달 */}
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        backgroundImage={backgroundImage}
        onImageSelect={handleBackgroundImageChange}
        onDataDeleted={() => {
          // 데이터 삭제 후 필요한 경우 리로드
        }}
      />

      {/* 만료 경고 모달 */}
      <ExpiryWarningModal
        visible={expiryWarningVisible}
        expiringData={expiringData}
        onClose={handleCloseExpiryWarning}
      />

      {/* 최종목표 필요 알림 모달 */}
      <AlertModal
        visible={alertModalVisible}
        title={t.homeScreen.mainGoalRequired || '최종목표 필요'}
        message={t.homeScreen.mainGoalRequiredMessage || '먼저 최종목표를 입력해주세요.'}
        buttons={[{ text: t.common.confirm || '확인', style: 'default' }]}
        onClose={() => setAlertModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MANDALART_COLORS.common.background,
  },
  containerTransparent: {
    backgroundColor: 'transparent',
  },
  // 웹 전용 스타일
  webBackgroundFull: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webCentered: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  gridWrapper: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: MANDALART_COLORS.common.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: MANDALART_COLORS.common.textSecondary,
    marginTop: 4,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 20,
    gap: 6,
  },
  savingText: {
    fontSize: 12,
    color: MANDALART_COLORS.common.success,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: MANDALART_COLORS.common.textSecondary,
  },
  backgroundContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: MANDALART_COLORS.common.error,
  },
  downloadButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  downloadButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: 'rgba(240, 240, 242, 0.85)',
    borderRadius: 99,
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    // Outer shadow
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});

