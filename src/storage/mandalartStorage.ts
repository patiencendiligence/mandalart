import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { MandalartData, createEmptyMandalart } from '../types/mandalart';

const STORAGE_KEY_PREFIX = '@mandalart_';
const DATA_EXPIRY_YEARS = 2;
const WARNING_MONTHS_BEFORE = 1;

// 웹에서는 localStorage 직접 사용 (iframe 호환성)
const isWeb = Platform.OS === 'web' && typeof localStorage !== 'undefined';

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isWeb) {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (isWeb) {
      localStorage.removeItem(key);
      return;
    }
    return AsyncStorage.removeItem(key);
  },
  getAllKeys: async (): Promise<readonly string[]> => {
    if (isWeb) {
      return Object.keys(localStorage);
    }
    return AsyncStorage.getAllKeys();
  },
  multiGet: async (keys: readonly string[]): Promise<readonly [string, string | null][]> => {
    if (isWeb) {
      return keys.map(key => [key, localStorage.getItem(key)] as [string, string | null]);
    }
    return AsyncStorage.multiGet(keys);
  },
};

// 만다라트 저장
export async function saveMandalart(data: MandalartData): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${data.id}`;
    const jsonValue = JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    await storage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Failed to save mandalart:', error);
    throw error;
  }
}

// 만다라트 불러오기
export async function loadMandalart(id: string): Promise<MandalartData | null> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    const jsonValue = await storage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Failed to load mandalart:', error);
    return null;
  }
}

// 특정 기간의 만다라트 불러오기 (없으면 생성)
export async function loadOrCreateMandalart(
  period: 'monthly' | 'yearly',
  year: number,
  month?: number
): Promise<MandalartData> {
  const id = `${period}-${year}${month ? `-${month}` : ''}`;
  const existing = await loadMandalart(id);
  
  if (existing) {
    return existing;
  }
  
  const newMandalart = createEmptyMandalart(period, year, month);
  await saveMandalart(newMandalart);
  return newMandalart;
}

// 모든 만다라트 목록 조회
export async function getAllMandalarts(): Promise<MandalartData[]> {
  try {
    const keys = await storage.getAllKeys();
    const mandalartKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));
    const items = await storage.multiGet(mandalartKeys);
    
    const results: MandalartData[] = [];
    for (const [key, value] of items) {
      if (!value) continue;
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          results.push(parsed);
        }
      } catch (parseError) {
        console.warn(`Invalid JSON for key ${key}, removing corrupted data`);
        // 손상된 데이터 삭제
        await storage.removeItem(key);
      }
    }
    
    return results.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error('Failed to get all mandalarts:', error);
    return [];
  }
}

// 만다라트 삭제
export async function deleteMandalart(id: string): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    await storage.removeItem(key);
  } catch (error) {
    console.error('Failed to delete mandalart:', error);
    throw error;
  }
}

// 데이터의 날짜 정보 파싱
function parseMandalartDate(data: MandalartData): Date {
  if (data.period === 'yearly') {
    return new Date(data.year, 11, 31); // 연간 목표는 해당 연도 말
  }
  return new Date(data.year, (data.month || 1) - 1, 1); // 월간 목표는 해당 월 초
}

// 만료 예정 데이터 조회 (1개월 전 경고 대상)
export async function getExpiringMandalarts(): Promise<MandalartData[]> {
  try {
    const allData = await getAllMandalarts();
    const now = new Date();
    const warningDate = new Date(
      now.getFullYear() - DATA_EXPIRY_YEARS,
      now.getMonth() + WARNING_MONTHS_BEFORE,
      now.getDate()
    );
    const expiryDate = new Date(
      now.getFullYear() - DATA_EXPIRY_YEARS,
      now.getMonth(),
      now.getDate()
    );

    return allData.filter(data => {
      const dataDate = parseMandalartDate(data);
      // 만료 1개월 전 ~ 만료일 사이의 데이터
      return dataDate <= warningDate && dataDate > expiryDate;
    });
  } catch (error) {
    console.error('Failed to get expiring mandalarts:', error);
    return [];
  }
}

// 만료된 데이터 조회 (2년 경과)
export async function getExpiredMandalarts(): Promise<MandalartData[]> {
  try {
    const allData = await getAllMandalarts();
    const now = new Date();
    const expiryDate = new Date(
      now.getFullYear() - DATA_EXPIRY_YEARS,
      now.getMonth(),
      now.getDate()
    );

    return allData.filter(data => {
      const dataDate = parseMandalartDate(data);
      return dataDate <= expiryDate;
    });
  } catch (error) {
    console.error('Failed to get expired mandalarts:', error);
    return [];
  }
}

// 만료된 데이터 자동 삭제
export async function deleteExpiredMandalarts(): Promise<number> {
  try {
    const expiredData = await getExpiredMandalarts();
    for (const data of expiredData) {
      await deleteMandalart(data.id);
    }
    return expiredData.length;
  } catch (error) {
    console.error('Failed to delete expired mandalarts:', error);
    return 0;
  }
}

// 당월 이전 데이터 조회
export async function getPastMandalarts(): Promise<MandalartData[]> {
  try {
    const allData = await getAllMandalarts();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return allData.filter(data => {
      if (data.period === 'yearly') {
        return data.year < currentYear;
      }
      // monthly
      if (data.year < currentYear) return true;
      if (data.year === currentYear && (data.month || 1) < currentMonth) return true;
      return false;
    });
  } catch (error) {
    console.error('Failed to get past mandalarts:', error);
    return [];
  }
}

// 당월 이전 데이터 전체 삭제
export async function deletePastMandalarts(): Promise<number> {
  try {
    const pastData = await getPastMandalarts();
    for (const data of pastData) {
      await deleteMandalart(data.id);
    }
    return pastData.length;
  } catch (error) {
    console.error('Failed to delete past mandalarts:', error);
    return 0;
  }
}

// 경고 알림 표시 여부 확인 (매월 말일에 한 번만)
const WARNING_SHOWN_KEY = '@mandalart_warning_shown_month';

// 오늘이 해당 월의 말일인지 확인
function isLastDayOfMonth(): boolean {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.getMonth() !== today.getMonth();
}

export async function shouldShowExpiryWarning(): Promise<boolean> {
  try {
    // 말일이 아니면 표시하지 않음
    if (!isLastDayOfMonth()) {
      return false;
    }

    const lastShownMonth = await storage.getItem(WARNING_SHOWN_KEY);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM 형식
    
    // 이번 달에 이미 표시했으면 표시하지 않음
    if (lastShownMonth === currentMonth) {
      return false;
    }
    
    const expiringData = await getExpiringMandalarts();
    return expiringData.length > 0;
  } catch (error) {
    console.error('Failed to check expiry warning:', error);
    return false;
  }
}

export async function markWarningShown(): Promise<void> {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM 형식
    await storage.setItem(WARNING_SHOWN_KEY, currentMonth);
  } catch (error) {
    console.error('Failed to mark warning shown:', error);
  }
}

