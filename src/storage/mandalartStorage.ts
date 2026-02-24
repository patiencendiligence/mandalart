import AsyncStorage from '@react-native-async-storage/async-storage';
import { MandalartData, createEmptyMandalart } from '../types/mandalart';

const STORAGE_KEY_PREFIX = '@mandalart_';

// 만다라트 저장
export async function saveMandalart(data: MandalartData): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${data.id}`;
    const jsonValue = JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Failed to save mandalart:', error);
    throw error;
  }
}

// 만다라트 불러오기
export async function loadMandalart(id: string): Promise<MandalartData | null> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    const jsonValue = await AsyncStorage.getItem(key);
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
    const keys = await AsyncStorage.getAllKeys();
    const mandalartKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));
    const items = await AsyncStorage.multiGet(mandalartKeys);
    
    return items
      .map(([_, value]) => (value ? JSON.parse(value) : null))
      .filter((item): item is MandalartData => item !== null)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('Failed to get all mandalarts:', error);
    return [];
  }
}

// 만다라트 삭제
export async function deleteMandalart(id: string): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${id}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to delete mandalart:', error);
    throw error;
  }
}

