import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MANDALART_COLORS, LIQUID_GLASS_STYLE } from '../utils/colors';

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
      borderTopLeftRadius: (mergeTop || mergeLeft) ? 2 : borderRadius,
      borderTopRightRadius: (mergeTop || mergeRight) ? 2 : borderRadius,
      borderBottomLeftRadius: (mergeBottom || mergeLeft) ? 2 : borderRadius,
      borderBottomRightRadius: (mergeBottom || mergeRight) ? 2 : borderRadius,
    };
  };

  // Merge 방향에 따른 border 숨김
  const getMergedBorders = () => {
    return {
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    };
  };

  const mergedRadius = completed ? getMergedBorderRadius() : { borderRadius };
  const mergedBorders = { borderWidth: 0 };
  
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
  
  const mergedMargins = getMergedMargins();

  const dynamicStyles = {
    cell: {
      width: cellSize,
      height: cellSize,
      backgroundColor: glassStyle.backgroundColor,
      borderWidth: 0,
      ...mergedRadius,
      ...mergedMargins,
      shadowColor: glassStyle.shadowColor,
      shadowOffset: glassStyle.shadowOffset,
      shadowOpacity: glassStyle.shadowOpacity,
      shadowRadius: glassStyle.shadowRadius,
      elevation: completed ? 5 : 4,
    },
    text: {
      color: '#333',
      fontSize,
      opacity: completed ? 0.6 : 1,
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
  },
  
  centerCell: {},
  
  mainCell: {
    backgroundColor: 'rgba(187, 187, 188, 0.18)',
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

