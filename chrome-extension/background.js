// 만다라트 크롬 확장프로그램 백그라운드 서비스 워커

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('만다라트 확장프로그램이 설치되었습니다.');
  } else if (details.reason === 'update') {
    console.log('만다라트 확장프로그램이 업데이트되었습니다.');
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.action.openPopup();
});
