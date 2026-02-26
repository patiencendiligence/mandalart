import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MANDALART_COLORS, getSubGoalColor } from '../utils/colors';

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
}: CellProps) {
  const colors = type === 'main' 
    ? MANDALART_COLORS.main 
    : getSubGoalColor(subGoalIndex);
  
  const fontSize = Math.max(8, cellSize * 0.2);
  
  const dynamicStyles = {
    cell: {
      width: cellSize,
      height: cellSize,
      backgroundColor: isCenter ? colors.bg : (type === 'main' ? colors.bg : colors.bg),
      borderColor: colors.border,
      opacity: completed ? 0.6 : 1,
      borderWidth: noBorder ? 0 : undefined,
    },
    text: {
      color: colors.text,
      fontSize,
      textDecorationLine: completed ? 'line-through' as const : 'none' as const,
    },
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
    >
      <Text
        style={[styles.text, dynamicStyles.text]}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {text || (isCenter ? '목표' : '+')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 1,
    margin: 0,
  },
  
  centerCell: {
    borderWidth: 1,
  },
  mainCell: {
    borderWidth: 1,
  },

  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

