export const ko = {
  common: {
    close: '닫기',
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    confirm: '확인',
    edit: '수정',
    loading: '불러오는 중...',
    saving: '저장 중...',
    error: '데이터를 불러올 수 없습니다',
  },
  
  periodSelector: {
    monthly: '월간',
    yearly: '연간',
    yearUnit: '년',
    months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  },
  
  homeScreen: {
    yearlyGoal: '{{year}}년 목표',
    monthlyGoal: '{{year}}년 {{month}}월 목표',
    downloadImage: '📥 이미지로 다운로드하기',
    mainGoalRequired: '최종목표 필요',
    mainGoalRequiredMessage: '먼저 최종목표를 입력해주세요.',
  },
  
  onboarding: {
    periodYearly: '{{year}}년',
    periodMonthly: '{{year}}년 {{month}}월',
    suffix: '에 나는',
    placeholder: "'무엇'을 할거야?",
    start: '시작',
  },
  
  editModal: {
    mainGoal: '🎯 최종 목표',
    subGoal: '세부목표 {{index}}',
    actionPlan: '✓ 실행계획',
    mainGoalPlaceholder: '달성하고 싶은 최종 목표를 입력하세요',
    subGoalPlaceholder: '목표 달성을 위한 세부 계획을 입력하세요',
    actionPlaceholder: '구체적인 실행 계획을 입력하세요',
    cancelComplete: '완료취소',
    complete: '실행완료',
    batchSubGoals: '📝 {{mainGoal}}를 이루기 위한 세부목표들',
    batchActions: '📝 {{subGoal}}을 이루기 위한 실행계획들',
    subGoalLabel: '세부목표',
    actionLabel: '실행계획',
  },
  
  detailModal: {
    subGoalLabel: '세부목표 {{index}}',
    subGoalPlaceholder: '세부목표를 입력하세요',
    actionPlan: '실행 계획',
    completeAll: '전체 완료',
    addAction: '실행계획 추가',
    progress: '진행률',
  },
  
  infoModal: {
    title: '만다라트(Mandalart)',
    origin: '📖 유래',
    originText: '만다라트는 일본의 프로 야구 선수 오타니 쇼헤이가 고안한 목표 달성 기법입니다. "Mandala"와 "Art"를 합친 이름으로, 9*9 그리드 형태의 구조를 통해 목표를 체계적으로 분해하고 관리합니다.',
    howToUse: '🎯 사용 방법',
    step1Title: '1. 메인 목표 설정',
    step1Text: '중앙의 큰 칸에 달성하고 싶은 최종 목표를 입력합니다.',
    step2Title: '2. 8개의 세부 목표 작성',
    step2Text: '메인 목표 주변의 8개 칸에 메인 목표를 달성하기 위한 세부 목표들을 작성합니다.',
    step3Title: '3. 액션 아이템 분해',
    step3Text: '각 세부 목표를 클릭하여, 그 세부 목표를 달성하기 위한 구체적인 8개의 액션 아이템을 입력합니다.',
    step4Title: '4. 진행 상황 추적',
    step4Text: '완료한 액션 아이템을 체크하여 진행 상황을 시각적으로 추적합니다.',
    step5Title: '5. 주기적 검토',
    step5Text: '월간/연간으로 목표를 전환하여 다양한 시간 단위의 목표를 관리합니다.',
    tips: '💡 팁',
    tip1: '• 세부 목표는 메인 목표를 달성하기 위한 핵심 영역들이어야 합니다.',
    tip2: '• 각 액션 아이템은 구체적이고 실행 가능해야 합니다.',
    tip3: '• 정기적으로 진행 상황을 확인하고 목표를 조정합니다.',
    tip4: '• 한 달에 한 번씩 월간 목표를 검토하고 새로운 목표를 설정하세요.',
  },
  
  celebrationModal: {
    congratulations: '축하합니다!',
    achievedGoal: '{{year}}년 {{month}}월 목표를 모두 달성했어요!',
    evaluateMonth: '이번 달을 평가해주세요',
    leaveReflection: '간단한 회고를 남겨주세요',
    charLimit: '15자 이내로 작성',
  },
  
  reflectionEmojis: {
    veryBad: '매우 아쉽다',
    bad: '아쉽다',
    neutral: '보통',
    good: '잘했다',
    veryGood: '매우 잘했다',
  },
  
  settingsModal: {
    title: '설정',
    backgroundImage: '배경 이미지',
    backgroundImageDesc: '나만의 배경 이미지를 설정하세요',
    selectImage: '이미지 선택',
    changeImage: '이미지 변경',
    removeImage: '제거',
    permissionRequired: '권한 필요',
    permissionMessage: '이미지를 선택하려면 갤러리 접근 권한이 필요합니다.',
    dataManagement: '데이터 관리',
    dataManagementDesc: '당월 이전의 모든 만다라트 데이터를 삭제합니다.\n(데이터는 2년 후 자동 삭제됩니다)',
    deletePastData: '지난 데이터 삭제',
    deletePastDataButton: '🗑️ 지난 데이터 삭제 ({{count}}개)',
    deleteConfirmTitle: '지난 데이터 삭제',
    deleteConfirmMessage: '당월 이전의 모든 데이터({{count}}개)를 삭제하시겠습니까?\n\n삭제된 데이터는 복구할 수 없습니다.',
    deleteComplete: '삭제 완료',
    deleteCompleteMessage: '{{count}}개의 지난 데이터가 삭제되었습니다.',
    language: '언어',
    languageDesc: '앱에서 사용할 언어를 선택하세요',
  },
  
  expiryWarningModal: {
    title: '데이터 만료 예정 알림',
    description: '아래 데이터가 1개월 후 자동 삭제됩니다.\n필요한 경우 이미지로 저장해 주세요.',
    yearlyGoal: '{{year}}년 연간 목표',
    monthlyGoal: '{{year}}년 {{month}}월 목표',
    notice: '💡 설정에서 "이미지로 다운로드하기"를 통해 데이터를 보관하세요.',
  },
  
  imageExport: {
    chartTitle: '만다라트 차트',
    saveImage: '📥 이미지 저장',
  },
  
  cell: {
    goal: '목표',
    mainGoal: '최종 목표',
    subGoal: '세부목표',
    actionPlan: '실행계획',
    notEntered: '미입력',
    completed: '완료됨',
    emptyGoal: '목표는?',
  },
};

export type TranslationKeys = typeof ko;
