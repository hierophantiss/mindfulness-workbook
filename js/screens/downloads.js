/* ═══ js/screens/downloads.js ═══ */
function buildDownloadsScreen() {
  const screen = document.getElementById('screen-downloads');
  screen.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()">←</button>
        <div class="screen-title">${t('menuDownloads')}</div>
      </div>
      <div class="content-card" style="cursor:pointer" onclick="window.open(LANG==='el'?'workbook_el.pdf':'workbook_en.pdf','_blank')">
        <h3>📥 ${t('dlPdfName')}</h3>
        <p>${t('dlPdfDesc')}</p>
      </div>
      <div class="content-card" id="installCard" style="cursor:pointer" onclick="installApp()">
        <h3>📱 ${t('dlAppName')}</h3>
        <p>${t('dlAppDesc')}</p>
      </div>
      <div class="spacer-bottom"></div>
    </div>`;
}
