import { TranslationKeys } from './ko';

export const en: TranslationKeys = {
  common: {
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'OK',
    edit: 'Edit',
    loading: 'Loading...',
    saving: 'Saving...',
    error: 'Failed to load data',
  },
  
  periodSelector: {
    monthly: 'Monthly',
    yearly: 'Yearly',
    yearUnit: '',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  
  homeScreen: {
    yearlyGoal: '{{year}} Goals',
    monthlyGoal: '{{month}} {{year}} Goals',
    downloadImage: '📥 Download as Image',
  },
  
  onboarding: {
    periodYearly: 'In {{year}}',
    periodMonthly: 'In {{month}} {{year}}',
    suffix: ', I will',
    placeholder: "What will you achieve?",
    start: 'Start',
  },
  
  editModal: {
    mainGoal: '🎯 Main Goal',
    subGoal: 'Sub-goal {{index}}',
    actionPlan: '✓ Action Plan',
    mainGoalPlaceholder: 'Enter your ultimate goal',
    subGoalPlaceholder: 'Enter a detailed plan to achieve your goal',
    actionPlaceholder: 'Enter a specific action plan',
    cancelComplete: 'Undo',
    complete: 'Complete',
  },
  
  detailModal: {
    subGoalLabel: 'Sub-goal {{index}}',
    subGoalPlaceholder: 'Enter sub-goal',
    actionPlan: 'Action Plans',
    completeAll: 'Complete All',
    addAction: 'Add action',
    progress: 'Progress',
  },
  
  infoModal: {
    title: 'Mandalart',
    origin: '📖 Origin',
    originText: 'Mandalart is a goal-setting technique popularized by Japanese baseball player Shohei Ohtani. The name combines "Mandala" and "Art", using a 9×9 grid structure to systematically break down and manage goals.',
    howToUse: '🎯 How to Use',
    step1Title: '1. Set Main Goal',
    step1Text: 'Enter your ultimate goal in the center cell.',
    step2Title: '2. Write 8 Sub-goals',
    step2Text: 'Fill in the 8 cells around the main goal with sub-goals to achieve your main objective.',
    step3Title: '3. Break Down Actions',
    step3Text: 'Click each sub-goal and enter 8 specific action items to achieve that sub-goal.',
    step4Title: '4. Track Progress',
    step4Text: 'Check off completed action items to visually track your progress.',
    step5Title: '5. Regular Review',
    step5Text: 'Switch between monthly/yearly goals to manage objectives across different time scales.',
    tips: '💡 Tips',
    tip1: '• Sub-goals should cover key areas needed to achieve your main goal.',
    tip2: '• Each action item should be specific and actionable.',
    tip3: '• Regularly check progress and adjust goals as needed.',
    tip4: '• Review monthly goals once a month and set new ones.',
  },
  
  celebrationModal: {
    congratulations: 'Congratulations!',
    achievedGoal: "You've achieved all goals for {{month}} {{year}}!",
    evaluateMonth: 'Rate this month',
    leaveReflection: 'Leave a brief reflection',
    charLimit: 'Max 15 characters',
  },
  
  reflectionEmojis: {
    veryBad: 'Very Poor',
    bad: 'Poor',
    neutral: 'Okay',
    good: 'Good',
    veryGood: 'Excellent',
  },
  
  settingsModal: {
    title: 'Settings',
    backgroundImage: 'Background Image',
    backgroundImageDesc: 'Set your own background image',
    selectImage: 'Select Image',
    changeImage: 'Change Image',
    removeImage: 'Remove',
    permissionRequired: 'Permission Required',
    permissionMessage: 'Gallery access permission is required to select an image.',
    dataManagement: 'Data Management',
    dataManagementDesc: 'Delete all mandalart data before the current month.\n(Data is automatically deleted after 2 years)',
    deletePastData: 'Delete Past Data',
    deletePastDataButton: '🗑️ Delete Past Data ({{count}})',
    deleteConfirmTitle: 'Delete Past Data',
    deleteConfirmMessage: 'Delete all data before this month ({{count}} items)?\n\nThis action cannot be undone.',
    deleteComplete: 'Deletion Complete',
    deleteCompleteMessage: '{{count}} past data items have been deleted.',
    language: 'Language',
    languageDesc: 'Select your preferred language',
  },
  
  expiryWarningModal: {
    title: 'Data Expiry Warning',
    description: 'The following data will be automatically deleted in 1 month.\nPlease save as image if needed.',
    yearlyGoal: '{{year}} Yearly Goals',
    monthlyGoal: '{{month}} {{year}} Goals',
    notice: '💡 Save your data via "Download as Image" in settings.',
  },
  
  imageExport: {
    chartTitle: 'Mandalart Chart',
    saveImage: '📥 Save Image',
  },
  
  cell: {
    goal: 'Goal',
    mainGoal: 'Main Goal',
    subGoal: 'Sub-goal',
    actionPlan: 'Action',
    notEntered: 'Empty',
    completed: 'Done',
  },
};
