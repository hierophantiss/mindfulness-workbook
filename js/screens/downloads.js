/* ═══ js/screens/downloads.js ═══ */
function triggerPdfDownload() {
  const file = LANG === 'el' ? 'workbook_el.pdf' : 'workbook_en.pdf';
  const a = document.createElement('a');
  a.href = file;
  a.download = file;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function buildDownloadsScreen() {
  const screen = document.getElementById('screen-downloads');
  screen.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()">←</button>
        <div class="screen-title">${t('menuDownloads')}</div>
      </div>
      <div class="content-card" style="cursor:pointer" onclick="triggerPdfDownload()">
        <h3>📥 ${t('dlPdfName')}</h3>
        <p>${t('dlPdfDesc')}</p>
      </div>
      <div class="content-card" id="installCard" style="cursor:pointer" onclick="installApp()">
        <h3>📱 ${t('dlAppName')}</h3>
        <p>${t('dlAppDesc')}</p>
      </div>
    </div>`;
}

window.buildDownloadsScreen = buildDownloadsScreen;
window.triggerPdfDownload = triggerPdfDownload;
