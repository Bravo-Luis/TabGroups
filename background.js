chrome.runtime.onInstalled.addListener(() => {
    console.log('Service Worker registered');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: 'index.html' });
  });
  