import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { MandalartGrid } from '../components/MandalartGrid';
import { EditModal } from '../components/EditModal';
import { DetailModal } from '../components/DetailModal';
import { InfoModal } from '../components/InfoModal';
import { PeriodSelector } from '../components/PeriodSelector';
import { useMandalart } from '../hooks/useMandalart';
import { SelectedCell } from '../types/mandalart';
import { MANDALART_COLORS } from '../utils/colors';

export function HomeScreen() {
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
    updateAction,
    toggleActionComplete,
  } = useMandalart(period, year, period === 'monthly' ? month : undefined);

  // 모달 상태
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [selectedSubGoalIndex, setSelectedSubGoalIndex] = useState<number>(0);

  // 셀 클릭 핸들러
  const handleCellPress = useCallback((
    type: 'main' | 'subGoal' | 'action',
    subGoalIndex: number,
    actionIndex?: number
  ) => {
    setSelectedCell({ type, subGoalIndex, actionIndex });
    setEditModalVisible(true);
  }, []);

  // 세부목표 그리드 클릭 핸들러 (줌인)
  const handleSubGoalGridPress = useCallback((subGoalIndex: number) => {
    setSelectedSubGoalIndex(subGoalIndex);
    setDetailModalVisible(true);
  }, []);

  // 모달 닫기
  const handleCloseEditModal = useCallback(() => {
    setEditModalVisible(false);
    setSelectedCell(null);
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MANDALART_COLORS.common.background} />
      
      {/* 헤더 */}
      <View style={styles.header}>
        {/* <Text style={styles.headerTitle}>만다라트</Text> */}
        <Text style={styles.headerSubtitle}>
          {period === 'yearly' ? `${year}년 목표` : `${year}년 ${month}월 목표`}
        </Text>
        {saving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator size="small" color={MANDALART_COLORS.common.success} />
            <Text style={styles.savingText}>저장 중...</Text>
          </View>
        )}
      </View>

      {/* 기간 선택 */}
      <PeriodSelector
        period={period}
        year={year}
        month={month}
        onPeriodChange={setPeriod}
        onYearChange={setYear}
        onMonthChange={setMonth}
        onInfoPress={() => setInfoModalVisible(true)}
      />

      {/* 메인 그리드 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={MANDALART_COLORS.common.text} />
          <Text style={styles.loadingText}>불러오는 중...</Text>
        </View>
      ) : data ? (
        <MandalartGrid
          data={data}
          onCellPress={handleCellPress}
          onSubGoalGridPress={handleSubGoalGridPress}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>데이터를 불러올 수 없습니다</Text>
        </View>
      )}

      {/* 편집 모달 */}
      <EditModal
        visible={editModalVisible}
        selectedCell={selectedCell}
        data={data}
        onClose={handleCloseEditModal}
        onSaveMain={handleSaveMain}
        onSaveSubGoal={handleSaveSubGoal}
        onSaveAction={handleSaveAction}
        onToggleComplete={handleToggleComplete}
      />

      {/* 상세 모달 (줌인 뷰) */}
      <DetailModal
        visible={detailModalVisible}
        subGoal={data?.subGoals[selectedSubGoalIndex] ?? null}
        subGoalIndex={selectedSubGoalIndex}
        onClose={handleCloseDetailModal}
        onCellPress={handleDetailCellPress}
      />

      {/* 정보 모달 */}
      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MANDALART_COLORS.common.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: MANDALART_COLORS.common.surface,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: MANDALART_COLORS.common.error,
  },
});

