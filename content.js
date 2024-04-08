
(function() {
    const urlPattern = /^https:\/\/www\.studydrive\.net\/[a-z]{2}\/doc\//i;
    if (urlPattern.test(window.location.href)) {
        const newButton = createButton();

        document.body.appendChild(newButton);

        function createButton() {
            const button = document.createElement('button');
            button.className = 'dnbtn';
            button.style.backgroundColor = 'green';
            button.style.color = 'white';
            button.style.padding = '15px';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.zIndex = '1000';
            button.style.transition = 'transform 0.3s ease-in-out';

            const buttonText = document.createElement('span');
            buttonText.textContent = 'Download Document';
            button.appendChild(buttonText);

           
            return button;
        }

        newButton.addEventListener('mouseenter', function() {
            newButton.style.transform = 'scale(1.1)';
        });

        newButton.addEventListener('mouseleave', function() {
            newButton.style.transform = 'scale(1)';
        });

        newButton.addEventListener('click', async function() {
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
    }
})();
