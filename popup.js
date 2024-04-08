
document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.addEventListener('click', async function() {
        console.log('Download button clicked');


        const result = await fetch(window.location.href);
        const html = await result.text();

        const parsedLink = getDownloadLink(html);
        if (!parsedLink) {
            console.error('[StudyDrive Download] Download link not found', html);
            return;
        }

        const fileName = getFileName(html);

        const downloadResult = await fetch(parsedLink);
        const blob = await downloadResult.blob();
        downloadFile(blob, fileName);
    });

    const externalButton = document.getElementById('externalButton');
    externalButton.addEventListener('click', function() {
        console.log('External button clicked');
        chrome.tabs.create({ url: 'https://example.com' });
    });
});

function getDownloadLink(html) {
    const linkMatch = /"file_preview":("[^"]*")/.exec(html);
    if (!linkMatch) {
        return null;
    }
    return JSON.parse(linkMatch[1]);
}

function getFileName(html) {
    const fileNameMatch = /"filename":("[^"]*")/.exec(html);
    if (!fileNameMatch) {
        return "preview.pdf";
    }
    return JSON.parse(fileNameMatch[1]);
}

function downloadFile(blob, fileName) {
    var link = document.createElement('a');
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    link.target = "_blank";
    link.click();
}
