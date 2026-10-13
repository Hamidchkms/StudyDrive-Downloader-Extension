const menuId = 'download-studydrive-document';
const documentPattern = /^https:\/\/www\.studydrive\.net\/[a-z]{2}\/doc\//i;

function registerMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: menuId,
            title: 'Download StudyDrive document',
            contexts: ['page', 'selection', 'link', 'image'],
            documentUrlPatterns: ['https://www.studydrive.net/*/doc/*']
        });
    });
}

chrome.runtime.onInstalled.addListener(registerMenu);
chrome.runtime.onStartup.addListener(registerMenu);

async function downloadDocument(tab) {
    if (!tab || tab.id === undefined) return;
    try {
        if (!documentPattern.test(tab.url || '')) {
            throw new Error('Open a StudyDrive document page first.');
        }
        await chrome.action.setBadgeText({ tabId: tab.id, text: '' });
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
        const result = results[0]?.result;
        if (!result?.ok) throw new Error(result?.error || 'The download script did not finish.');
        await chrome.action.setTitle({ tabId: tab.id, title: 'Download StudyDrive document' });
    } catch (error) {
        console.error('[StudyDrive Download]', error);
        await chrome.action.setBadgeText({ tabId: tab.id, text: 'ERR' });
        await chrome.action.setTitle({ tabId: tab.id, title: error.message });
    }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === menuId) downloadDocument(tab);
});
chrome.action.onClicked.addListener(downloadDocument);
