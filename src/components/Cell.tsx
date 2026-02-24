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
}: CellProps) {
  const colors = type === 'main' 
    ? MANDALART_COLORS.main 
    : getSubGoalColor(subGoalIndex);
  
  const cellSize = size === 'small' ? 28 : size === 'large' ? 80 : 45;
  const fontSize = size === 'small' ? 8 : size === 'large' ? 14 : 10;
  
  const dynamicStyles = {
    cell: {
      width: cellSize,
      height: cellSize,
      backgroundColor: isCenter ? colors.bg : (type === 'main' ? colors.bg : colors.bg),
      borderColor: colors.border,
      opacity: completed ? 0.6 : 1,
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
    padding: 2,
    margin: 1,
  },
  centerCell: {
    borderWidth: 2,
  },
  mainCell: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

