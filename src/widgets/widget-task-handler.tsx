import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { MandalartWidget, SmallMandalartWidget } from './MandalartWidget';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDGET_NAMES = {
  MANDALART: 'MandalartWidget',
  MANDALART_SMALL: 'MandalartWidgetSmall',
};

async function getWidgetData() {
  try {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    
    const yearlyKey = `mandalart_yearly_${year}`;
    const monthlyKey = `mandalart_monthly_${year}_${month}`;
    
    const yearlyData = await AsyncStorage.getItem(yearlyKey);
    const monthlyData = await AsyncStorage.getItem(monthlyKey);
    
    const data = yearlyData ? JSON.parse(yearlyData) : (monthlyData ? JSON.parse(monthlyData) : null);
    
    if (!data) {
      return {
        mainGoal: '',
        progress: 0,
        periodText: `${year}년`,
      };
    }
    
    let completedCount = 0;
    let totalCount = 0;
    
    if (data.subGoals) {
      data.subGoals.forEach((subGoal: any) => {
        if (subGoal?.actions) {
          subGoal.actions.forEach((action: any) => {
            totalCount++;
            if (action?.completed) {
              completedCount++;
            }
          });
        }
      });
    }
    
    const progress = totalCount > 0 ? completedCount / totalCount : 0;
    const periodText = yearlyData ? `${year}년` : `${year}년 ${month}월`;
    
    return {
      mainGoal: data.mainGoal || '',
      progress,
      periodText,
    };
  } catch (error) {
    console.error('Error getting widget data:', error);
    return {
      mainGoal: '',
      progress: 0,
      periodText: '',
    };
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<React.ReactElement> {
  const widgetInfo = props.widgetInfo;
  const widgetName = widgetInfo.widgetName;
  
  const data = await getWidgetData();
  
  switch (widgetName) {
    case WIDGET_NAMES.MANDALART:
      return <MandalartWidget {...data} />;
    case WIDGET_NAMES.MANDALART_SMALL:
      return <SmallMandalartWidget {...data} />;
    default:
      return <MandalartWidget {...data} />;
  }
}
