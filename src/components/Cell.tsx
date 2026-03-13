import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { LIQUID_GLASS_STYLE } from '../utils/colors';

interface CellProps {
  text: string;
  type: 'main' | 'subGoal' | 'action';
  subGoalIndex?: number;
  isCenter?: boolean;
  completed?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  cellSize?: number;
  noBorder?: boolean;
  // Liquid Glass merge 관련 props
  mergeTop?: boolean;
  mergeBottom?: boolean;
  mergeLeft?: boolean;
  mergeRight?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function Cell({
  text,
  type,
  subGoalIndex = 0,
  isCenter = false,
  completed = false,
  onPress,
  size = 'medium',
  cellSize = 45,
  noBorder = false,
  mergeTop = false,
  mergeBottom = false,
  mergeLeft = false,
  mergeRight = false,
}: CellProps) {
  const fontSize = Math.max(10, cellSize * 0.18);
  const borderRadius = cellSize * 0.12;
  
  // 완료 상태에 따른 Liquid Glass 스타일
  const glassStyle = completed 
    ? LIQUID_GLASS_STYLE.cellCompleted 
    : LIQUID_GLASS_STYLE.cell;

  // Merge 방향에 따른 borderRadius 조정
  const getMergedBorderRadius = () => {
    return {
      borderTopLeftRadius: (mergeTop || mergeLeft) ? 0 : borderRadius,
      borderTopRightRadius: (mergeTop || mergeRight) ? 0 : borderRadius,
      borderBottomLeftRadius: (mergeBottom || mergeLeft) ? 0 : borderRadius,
      borderBottomRightRadius: (mergeBottom || mergeRight) ? 0 : borderRadius,
    };
  };

  // Merge 방향에 따른 border 숨김 (완료된 셀 연결 시)
  const getMergedBorderWidths = () => {
    if (!completed) return {};
    return {
      borderTopWidth: mergeTop ? 0 : 1,
      borderBottomWidth: mergeBottom ? 0 : 1,
      borderLeftWidth: mergeLeft ? 0 : 1,
      borderRightWidth: mergeRight ? 0 : 1,
    };
  };

  const mergedRadius = completed ? getMergedBorderRadius() : { borderRadius };
  const mergedBorderWidths = getMergedBorderWidths();
  
  // 기본 마진 및 완료된 셀 연결 시 마진 조정
  const baseMargin = 3; // 기본 마진 (CELL_GAP/2)
  const getMergedMargins = () => {
    if (!completed) {
      return {
        margin: baseMargin,
      };
    }
    return {
      marginTop: mergeTop ? 0 : baseMargin,
      marginBottom: mergeBottom ? 0 : baseMargin,
      marginLeft: mergeLeft ? 0 : baseMargin,
      marginRight: mergeRight ? 0 : baseMargin,
    };
  };
  
  // 연결 방향으로 크기 확장하여 정렬 유지
  const getMergedSize = () => {
    if (!completed) return { width: cellSize, height: cellSize };
    const extraWidth = (mergeLeft ? baseMargin : 0) + (mergeRight ? baseMargin : 0);
    const extraHeight = (mergeTop ? baseMargin : 0) + (mergeBottom ? baseMargin : 0);
    return {
      width: cellSize + extraWidth,
      height: cellSize + extraHeight,
    };
  };
  
  const mergedMargins = getMergedMargins();
  const mergedSize = getMergedSize();

  // 플랫폼별 스타일
  const platformStyle = Platform.select({
    web: {
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      borderTopColor: glassStyle.borderTopColor,
      borderLeftColor: glassStyle.borderLeftColor,
      borderBottomColor: glassStyle.borderBottomColor,
      borderRightColor: glassStyle.borderRightColor,
    },
    android: {
      // Android에서는 개별 border 색상이 지원되지 않으므로 단일 색상 사용
      borderColor: completed ? 'rgba(200, 200, 200, 0.5)' : 'rgba(255, 255, 255, 0.4)',
      // Android shadow
      elevation: completed ? 0 : 3,
    },
    ios: {
      borderTopColor: glassStyle.borderTopColor,
      borderLeftColor: glassStyle.borderLeftColor,
      borderBottomColor: glassStyle.borderBottomColor,
      borderRightColor: glassStyle.borderRightColor,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: completed ? 0 : 0.1,
      shadowRadius: 4,
    },
    default: {},
  });

  const dynamicStyles = {
    cell: {
      ...mergedSize,
      backgroundColor: glassStyle.backgroundColor,
      borderWidth: glassStyle.borderWidth,
      ...mergedRadius,
      ...mergedBorderWidths,
      ...mergedMargins,
      ...platformStyle,
    },
    text: {
      color: '#333',
      fontSize,
      opacity: completed ? 0.7 : 1,
    },
  };

  const getAccessibilityLabel = () => {
    if (type === 'main') return `최종 목표: ${text || '미입력'}`;
    if (type === 'subGoal') return `세부목표 ${subGoalIndex + 1}: ${text || '미입력'}`;
    return `실행계획: ${text || '미입력'}${completed ? ', 완료됨' : ''}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        dynamicStyles.cell,
        isCenter && styles.centerCell,
        type === 'main' && styles.mainCell,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityState={{ disabled: !onPress }}
    >
      <Text
        style={[styles.text, dynamicStyles.text]}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {text || (isCenter ? '목표' : '+')}
      </Text>
      
      {completed && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    overflow: 'hidden',
  },
  
  centerCell: {},
  
  mainCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },

  text: {
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },

  checkBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34c759',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});

