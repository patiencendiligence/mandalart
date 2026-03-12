import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, useWindowDimensions, ImageBackground } from 'react-native';
import { MandalartData } from '../types/mandalart';

interface MandalartImageExportProps {
  data: MandalartData;
  onClose: () => void;
  backgroundImage?: string | null;
}

export function MandalartImageExport({ data, onClose, backgroundImage }: MandalartImageExportProps) {
  const { width: windowWidth } = useWindowDimensions();
  
  // 컨테이너 패딩과 마진을 고려한 가용 너비 계산
  const modalPadding = 16 * 2;
  const exportPadding = 24 * 2;
  const gridPadding = 12 * 2;
  const gridCellMargin = 2 * 2 * 3;
  
  const availableWidth = Math.min(windowWidth * 0.95, 480) - modalPadding - exportPadding - gridPadding - gridCellMargin;
  
  // 9x9 그리드 셀 크기 계산
  const cellGap = 2;
  const totalCellGaps = cellGap * 10;
  
  const cellSize = Math.floor((availableWidth - totalCellGaps) / 9);
  const fontSize = Math.max(7, cellSize * 0.22);

  const handleDownload = useCallback(async () => {
    if (Platform.OS !== 'web') {
      return;
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById('mandalart-export-image');
      if (!element) {
        console.error('Export element not found');
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: backgroundImage ? null : '#c8dae8',
        scale: 3,
        useCORS: true,
        logging: false,
      } as any);

      const link = document.createElement('a');
      link.download = `만다라트_${data.year}년_${data.month}월.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onClose();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  }, [data, onClose, backgroundImage]);

  const subGoalLayout = [
    [0, 1, 2],
    [3, -1, 4],
    [5, 6, 7],
  ];

  const actionLayout = [
    [0, 1, 2],
    [3, -1, 4],
    [5, 6, 7],
  ];

  // 동적 셀 스타일
  const baseCellStyle = {
    width: cellSize,
    height: cellSize,
    borderRadius: Math.max(6, cellSize * 0.18),
    margin: cellGap / 2,
  };

  const renderCell = (text: string, isCenter: boolean, isCenterGrid: boolean) => {
    let bgColor = 'rgba(255, 255, 255, 0.95)';
    let textColor = '#5a7a8a';
    let fontWeight: '400' | '500' | '600' | '700' | '800' = '500';
    
    if (isCenterGrid) {
      if (isCenter) {
        bgColor = 'rgba(255, 250, 235, 1)';
        textColor = '#3a4a5a';
        fontWeight = '700';
      } else {
        bgColor = 'rgba(255, 248, 225, 0.95)';
        textColor = '#5a6a7a';
        fontWeight = '600';
      }
    } else if (isCenter) {
      bgColor = 'rgba(230, 240, 250, 0.95)';
      textColor = '#4a6a8a';
      fontWeight = '600';
    }

    return (
      <View style={[
        styles.cell,
        baseCellStyle,
        { backgroundColor: bgColor }
      ]}>
        <Text 
          style={[
            styles.cellText, 
            { 
              fontSize, 
              lineHeight: fontSize * 1.25,
              color: textColor,
              fontWeight,
            }
          ]} 
          numberOfLines={2}
        >
          {text}
        </Text>
      </View>
    );
  };

  const renderMiniGrid = (subGoalIndex: number, isCenterGrid: boolean) => {
    const subGoal = subGoalIndex >= 0 ? data.subGoals[subGoalIndex] : null;
    
    return (
      <View style={isCenterGrid ? styles.centerMiniGrid : styles.miniGrid}>
        {actionLayout.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={styles.miniGridRow}>
            {row.map((actionIdx) => {
              if (actionIdx === -1) {
                const text = isCenterGrid ? data.mainGoal : (subGoal?.text || '');
                return (
                  <View key="center">
                    {renderCell(text, true, isCenterGrid)}
                  </View>
                );
              }
              
              if (isCenterGrid) {
                const sg = data.subGoals[actionIdx < 4 ? actionIdx : actionIdx + 1];
                return (
                  <View key={`sg-${actionIdx}`}>
                    {renderCell(sg?.text || '', false, true)}
                  </View>
                );
              }
              
              const action = subGoal?.actions[actionIdx];
              return (
                <View key={`action-${actionIdx}`}>
                  {renderCell(action?.text || '', false, false)}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 실제 내보낼 이미지 영역 */}
          <View 
            style={[styles.exportContainer, backgroundImage && styles.exportContainerWithBg]}
            // @ts-ignore
            id="mandalart-export-image"
          >
            {/* 배경 이미지 */}
            {backgroundImage && (
              <>
                <ImageBackground
                  source={{ uri: backgroundImage }}
                  style={styles.exportBackgroundImage}
                  resizeMode="cover"
                />
                <View style={styles.exportBackgroundOverlay} />
              </>
            )}
            {/* 헤더 */}
            <View style={[styles.header, { zIndex: 1 }]}>
              <View style={styles.headerLeft}>
                <Text style={styles.yearText}>{data.year}</Text>
                <Text style={styles.chartTitle}>만다라트 차트</Text>
                <Text style={styles.monthText}>
                  {data.month}월 {data.reflection?.text || ''}
                </Text>
              </View>
              {data.reflection?.emoji && (
                <Text style={styles.headerEmoji}>{data.reflection.emoji}</Text>
              )}
            </View>

            {/* Glass Container */}
            <View style={styles.glassContainer}>
              <View style={styles.glassHighlight} />
              
              {/* 9x9 그리드 */}
              <View style={styles.fullGrid}>
                {subGoalLayout.map((row, rowIdx) => (
                  <View key={`grid-row-${rowIdx}`} style={styles.gridRow}>
                    {row.map((subGoalIdx) => {
                      const isCenterGrid = subGoalIdx === -1;
                      return (
                        <View key={`grid-${subGoalIdx}`} style={styles.gridCell}>
                          {renderMiniGrid(subGoalIdx, isCenterGrid)}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Liquid Glass 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Text style={styles.downloadButtonText}>📥 이미지 저장</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  modal: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 16,
    width: '95%',
    maxWidth: 480,
    maxHeight: '92%',
    borderWidth: 0,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
  },
  scrollView: {
    maxHeight: '85%',
  },
  scrollContent: {
    alignItems: 'center',
  },
  exportContainer: {
    backgroundColor: '#dce6f0',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  exportContainerWithBg: {
    backgroundColor: 'transparent',
  },
  exportBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  exportBackgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flex: 1,
  },
  yearText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#5a9ac8',
    lineHeight: 40,
  },
  chartTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#5a9ac8',
    lineHeight: 30,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3a4a5a',
    marginTop: 6,
    lineHeight: 24,
  },
  headerEmoji: {
    fontSize: 44,
    marginLeft: 8,
  },
  glassContainer: {
    backgroundColor: 'rgba(187, 187, 188, 0.1)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  glassHighlight: {
    display: 'none',
  },
  fullGrid: {
    zIndex: 1,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    margin: 1,
  },
  miniGrid: {
    backgroundColor: 'rgba(187, 187, 188, 0.08)',
    borderRadius: 8,
    padding: 2,
    borderWidth: 0,
  },
  centerMiniGrid: {
    backgroundColor: 'rgba(187, 187, 188, 0.15)',
    borderRadius: 8,
    padding: 2,
    borderWidth: 0,
  },
  miniGridRow: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  cellText: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(180, 180, 185, 0.5)',
    borderRadius: 99,
    // Liquid glass border (어두운 버전)
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  downloadButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 99,
    // Liquid glass border
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.06)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});
