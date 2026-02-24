import { useState, useEffect, useCallback } from 'react';
import { MandalartData, SubGoal, ActionItem } from '../types/mandalart';
import { loadOrCreateMandalart, saveMandalart } from '../storage/mandalartStorage';

export function useMandalart(period: 'monthly' | 'yearly', year: number, month?: number) {
  const [data, setData] = useState<MandalartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 데이터 로드
  useEffect(() => {
    let isMounted = true;
    
    async function load() {
      setLoading(true);
      try {
        const mandalart = await loadOrCreateMandalart(period, year, month);
        if (isMounted) {
          setData(mandalart);
        }
      } catch (error) {
        console.error('Failed to load mandalart:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    load();
    
    return () => {
      isMounted = false;
    };
  }, [period, year, month]);

  // 메인 목표 업데이트
  const updateMainGoal = useCallback(async (text: string) => {
    if (!data) return;
    
    const updated = { ...data, mainGoal: text };
    setData(updated);
    
    setSaving(true);
    try {
      await saveMandalart(updated);
    } finally {
      setSaving(false);
    }
  }, [data]);

  // 세부목표 업데이트
  const updateSubGoal = useCallback(async (index: number, text: string) => {
    if (!data) return;
    
    const updatedSubGoals = [...data.subGoals];
    updatedSubGoals[index] = { ...updatedSubGoals[index], text };
    
    const updated = { ...data, subGoals: updatedSubGoals };
    setData(updated);
    
    setSaving(true);
    try {
      await saveMandalart(updated);
    } finally {
      setSaving(false);
    }
  }, [data]);

  // 액션 아이템 업데이트
  const updateAction = useCallback(async (
    subGoalIndex: number,
    actionIndex: number,
    updates: Partial<ActionItem>
  ) => {
    if (!data) return;
    
    const updatedSubGoals = [...data.subGoals];
    const updatedActions = [...updatedSubGoals[subGoalIndex].actions];
    updatedActions[actionIndex] = { ...updatedActions[actionIndex], ...updates };
    updatedSubGoals[subGoalIndex] = { ...updatedSubGoals[subGoalIndex], actions: updatedActions };
    
    const updated = { ...data, subGoals: updatedSubGoals };
    setData(updated);
    
    setSaving(true);
    try {
      await saveMandalart(updated);
    } finally {
      setSaving(false);
    }
  }, [data]);

  // 액션 완료 토글
  const toggleActionComplete = useCallback(async (subGoalIndex: number, actionIndex: number) => {
    if (!data) return;
    
    const currentAction = data.subGoals[subGoalIndex].actions[actionIndex];
    await updateAction(subGoalIndex, actionIndex, { completed: !currentAction.completed });
  }, [data, updateAction]);

  return {
    data,
    loading,
    saving,
    updateMainGoal,
    updateSubGoal,
    updateAction,
    toggleActionComplete,
  };
}

