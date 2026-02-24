import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MANDALART_COLORS } from '../utils/colors';

interface PeriodSelectorProps {
  period: 'monthly' | 'yearly';
  year: number;
  month?: number;
  onPeriodChange: (period: 'monthly' | 'yearly') => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onInfoPress?: () => void;
}

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export function PeriodSelector({
  period,
  year,
  month = 1,
  onPeriodChange,
  onYearChange,
  onMonthChange,
  onInfoPress,
}: PeriodSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <View style={styles.container}>
      {/* 헤더: 기간 토글 + 정보 버튼 */}
      <View style={styles.headerRow}>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, period === 'monthly' && styles.toggleButtonActive]}
            onPress={() => onPeriodChange('monthly')}
          >
            <Text style={[styles.toggleText, period === 'monthly' && styles.toggleTextActive]}>
              월간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, period === 'yearly' && styles.toggleButtonActive]}
            onPress={() => onPeriodChange('yearly')}
          >
            <Text style={[styles.toggleText, period === 'yearly' && styles.toggleTextActive]}>
              연간
            </Text>
          </TouchableOpacity>
        </View>
        
        {onInfoPress && (
          <TouchableOpacity style={styles.infoButton} onPress={onInfoPress}>
            <Text style={styles.infoButtonText}>?</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 연도 선택 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.yearScroll}
        contentContainerStyle={styles.yearScrollContent}
      >
        {years.map((y) => (
          <TouchableOpacity
            key={y}
            style={[styles.yearButton, year === y && styles.yearButtonActive]}
            onPress={() => onYearChange(y)}
          >
            <Text style={[styles.yearText, year === y && styles.yearTextActive]}>
              {y}년
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 월 선택 (월간 모드일 때만) */}
      {period === 'monthly' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthScroll}
          contentContainerStyle={styles.monthScrollContent}
        >
          {MONTHS.map((m, idx) => (
            <TouchableOpacity
              key={m}
              style={[styles.monthButton, month === idx + 1 && styles.monthButtonActive]}
              onPress={() => onMonthChange(idx + 1)}
            >
              <Text style={[styles.monthText, month === idx + 1 && styles.monthTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: MANDALART_COLORS.common.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MANDALART_COLORS.common.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: MANDALART_COLORS.common.surfaceLight,
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: MANDALART_COLORS.main.bg,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: MANDALART_COLORS.common.textMuted,
  },
  toggleTextActive: {
    color: MANDALART_COLORS.common.text,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MANDALART_COLORS.common.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MANDALART_COLORS.main.text,
  },
  yearScroll: {
    marginBottom: 8,
  },
  yearScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  yearButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  yearButtonActive: {
    backgroundColor: MANDALART_COLORS.common.surfaceLight,
  },
  yearText: {
    fontSize: 14,
    fontWeight: '500',
    color: MANDALART_COLORS.common.textMuted,
  },
  yearTextActive: {
    color: MANDALART_COLORS.common.text,
  },
  monthScroll: {
    marginTop: 4,
  },
  monthScrollContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  monthButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 6,
  },
  monthButtonActive: {
    backgroundColor: MANDALART_COLORS.subGoals[0].bg,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '500',
    color: MANDALART_COLORS.common.textMuted,
  },
  monthTextActive: {
    color: MANDALART_COLORS.subGoals[0].text,
  },
});

