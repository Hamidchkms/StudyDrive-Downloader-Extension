(async function() {
    const urlPattern = /^https:\/\/www\.studydrive\.net\/[a-z]{2}\/doc\//i;
    if (!urlPattern.test(window.location.href)) {
        return { ok: false, error: 'Open a StudyDrive document page first.' };
    }
    if (globalThis.studyDriveDownloadRunning) return { ok: true };
    globalThis.studyDriveDownloadRunning = true;

    try {
        const result = await fetch(window.location.href);
        if (!result.ok) throw new Error('Could not load the document page (HTTP ' + result.status + ').');
        const html = await result.text();
        const linkMatch = /"file_preview":("[^"]*")/.exec(html);
        if (!linkMatch) throw new Error('The page does not expose the file_preview link required by this downloader.');
        const parsedLink = JSON.parse(linkMatch[1]);

        const fileNameMatch = /"filename":("[^"]*")/.exec(html);
        let fileName = fileNameMatch ? JSON.parse(fileNameMatch[1]) : 'preview.pdf';
        if (fileName.endsWith('.docx')) fileName = fileName.slice(0, -5) + '.pdf';
        if (!fileName.endsWith('.pdf')) throw new Error('This downloader supports PDF previews only.');

        const downloadResult = await fetch(parsedLink);
        if (!downloadResult.ok) throw new Error('Could not download the preview (HTTP ' + downloadResult.status + ').');
        const blob = await downloadResult.blob();
        const link = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.href = objectUrl;
        link.target = '_blank';
        link.click();
        // One-time cleanup, not a polling or button-recreation loop.
        setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
        return { ok: true };
    } catch (error) {
        console.error('[StudyDrive Download]', error);
        alert('StudyDrive Downloader: ' + error.message);
        return { ok: false, error: error.message };
    } finally {
        globalThis.studyDriveDownloadRunning = false;
    }
})();
