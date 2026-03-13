import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android 위젯 업데이트용 함수
let requestWidgetUpdate: ((widgetName: string) => void) | null = null;

// 조건부로 Android 위젯 모듈 import
if (Platform.OS === 'android') {
  try {
    const AndroidWidget = require('react-native-android-widget');
    requestWidgetUpdate = AndroidWidget.requestWidgetUpdate;
  } catch (e) {
    console.log('Android widget module not available');
  }
}

export interface WidgetData {
  mainGoal: string;
  progress: number;
  periodText: string;
}

export async function updateWidgetData(data: WidgetData): Promise<void> {
  try {
    // AsyncStorage에 위젯용 데이터 저장
    await AsyncStorage.setItem('widget_mainGoal', data.mainGoal);
    await AsyncStorage.setItem('widget_progress', data.progress.toString());
    await AsyncStorage.setItem('widget_periodText', data.periodText);

    // Android 위젯 업데이트 요청
    if (Platform.OS === 'android' && requestWidgetUpdate) {
      requestWidgetUpdate('MandalartWidget');
      requestWidgetUpdate('MandalartWidgetSmall');
    }

    // iOS의 경우 WidgetKit을 통해 업데이트 (네이티브 모듈 필요)
    // 현재는 앱 그룹을 통해 데이터 공유만 구현
  } catch (error) {
    console.error('Error updating widget data:', error);
  }
}

export function calculateProgress(data: any): number {
  if (!data?.subGoals) return 0;

  let completedCount = 0;
  let totalCount = 0;

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

  return totalCount > 0 ? completedCount / totalCount : 0;
}

export function getWidgetPeriodText(isYearly: boolean, year: number, month?: number): string {
  if (isYearly) {
    return `${year}년`;
  }
  return `${year}년 ${month}월`;
}
