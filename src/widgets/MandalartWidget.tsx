import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

interface MandalartWidgetProps {
  mainGoal?: string;
  progress?: number;
  periodText?: string;
}

export function MandalartWidget({ mainGoal, progress = 0, periodText }: MandalartWidgetProps) {
  const progressPercent = Math.round(progress * 100);
  
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#e8e8e9',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      {/* 헤더 */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextWidget
          text="만다라트"
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#5a6a7a',
          }}
        />
        <TextWidget
          text={periodText || ''}
          style={{
            fontSize: 12,
            color: '#8a9aaa',
          }}
        />
      </FlexWidget>

      {/* 메인 목표 */}
      <FlexWidget
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
        }}
      >
        <TextWidget
          text={mainGoal || '목표를 설정하세요'}
          style={{
            fontSize: mainGoal ? 18 : 14,
            fontWeight: '700',
            color: mainGoal ? '#2a3a4a' : '#8a9aaa',
            textAlign: 'center',
          }}
          maxLines={2}
        />
      </FlexWidget>

      {/* 진행률 */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <FlexWidget
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TextWidget
            text="진행률"
            style={{
              fontSize: 12,
              color: '#5a6a7a',
            }}
          />
          <TextWidget
            text={`${progressPercent}%`}
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#5a9ac8',
            }}
          />
        </FlexWidget>
        
        {/* 프로그레스 바 */}
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 6,
            backgroundColor: 'rgba(90, 154, 200, 0.2)',
            borderRadius: 3,
          }}
        >
          <FlexWidget
            style={{
              width: `${progressPercent}%` as any,
              height: 6,
              backgroundColor: '#5a9ac8',
              borderRadius: 3,
            }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}

export function SmallMandalartWidget({ mainGoal, progress = 0 }: MandalartWidgetProps) {
  const progressPercent = Math.round(progress * 100);
  
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#e8e8e9',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      clickAction="OPEN_APP"
    >
      <TextWidget
        text="만다라트"
        style={{
          fontSize: 10,
          color: '#8a9aaa',
          marginBottom: 4,
        }}
      />
      <TextWidget
        text={mainGoal || '목표 설정'}
        style={{
          fontSize: 14,
          fontWeight: '700',
          color: '#2a3a4a',
          textAlign: 'center',
        }}
        maxLines={2}
      />
      <TextWidget
        text={`${progressPercent}%`}
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#5a9ac8',
          marginTop: 4,
        }}
      />
    </FlexWidget>
  );
}
