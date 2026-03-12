import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';


interface PeriodSelectorProps {
  period: 'monthly' | 'yearly';
  year: number;
  month?: number;
  onPeriodChange: (period: 'monthly' | 'yearly') => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onInfoPress?: () => void;
  onSettingsPress?: () => void;
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
  onSettingsPress,
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
        
        <View style={styles.headerButtons}>
          {onSettingsPress && (
            <TouchableOpacity style={styles.infoButton} onPress={onSettingsPress}>
              <Text style={styles.infoButtonText}>⚙</Text>
            </TouchableOpacity>
          )}
          {onInfoPress && (
            <TouchableOpacity style={styles.infoButton} onPress={onInfoPress}>
              <Text style={styles.infoButtonText}>?</Text>
            </TouchableOpacity>
          )}
        </View>
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
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(235, 235, 240, 0.9)',
    borderRadius: 99,
    padding: 4,
    // Liquid glass border
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
    // Outer shadow
    shadowColor: 'rgba(0, 0, 0, 0.18)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  toggleButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 99,
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(240, 240, 245, 0.95)',
    borderRadius: 99,
    // Liquid glass active state
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8a9aaa',
  },
  toggleTextActive: {
    color: '#2a3a4a',
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: 'rgba(240, 240, 242, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    // Liquid glass border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a6a7a',
  },
  yearScroll: {
    marginBottom: 8,
  },
  yearScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  yearButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 6,
    backgroundColor: 'rgba(235, 235, 240, 0.6)',
    // Subtle border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderRightColor: 'rgba(0, 0, 0, 0.03)',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  yearButtonActive: {
    backgroundColor: 'rgba(240, 240, 245, 0.9)',
    // Liquid glass active
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8a9aaa',
  },
  yearTextActive: {
    color: '#2a3a4a',
    fontWeight: '700',
  },
  monthScroll: {
    marginTop: 4,
  },
  monthScrollContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  monthButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 5,
    backgroundColor: 'rgba(235, 235, 240, 0.5)',
    // Subtle border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    borderRightColor: 'rgba(0, 0, 0, 0.02)',
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  monthButtonActive: {
    backgroundColor: 'rgba(240, 240, 245, 0.9)',
    // Liquid glass active
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8a9aaa',
  },
  monthTextActive: {
    color: '#2a3a4a',
    fontWeight: '700',
  },
});

