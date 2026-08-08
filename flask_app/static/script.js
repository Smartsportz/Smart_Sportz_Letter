const state = {
  method: 'method1',
  offset: Number(localStorage.getItem('letterOffset') || 0)
};

const els = {
  methodTabs: document.querySelectorAll('.tab'),
  method1: document.querySelector('.method1'),
  method2: document.querySelector('.method2'),
  preview1: document.getElementById('preview-method1'),
  preview2: document.getElementById('preview-method2'),
  pdfBtn: document.getElementById('pdf-btn'),
  content: document.getElementById('letter-content'),
  moveUp: document.getElementById('move-up'),
  moveDown: document.getElementById('move-down'),
  addPage: document.getElementById('add-page'),
  removePage: document.getElementById('remove-page'),
  stack: document.getElementById('preview-stack')
};

function cleanParagraphs(text) {
  return (text || '')
    .trim()
    .split(/\n\s*\n/)
    .map(part => part.trim())
    .filter(Boolean)
    .join('\n\n');
}

function renderMethod1() {
  document.getElementById('p-m1-title').textContent = document.getElementById('m1-title').value.trim();
  document.getElementById('p-m1-from').textContent = document.getElementById('m1-from').value.trim();
  document.getElementById('p-m1-to').textContent = document.getElementById('m1-to').value.trim();
  document.getElementById('p-m1-subject').textContent = document.getElementById('m1-subject').value.trim();
  document.getElementById('p-m1-body').textContent = cleanParagraphs(document.getElementById('m1-body').value);
}

function renderMethod2() {
  document.getElementById('p-m2-title').textContent = document.getElementById('m2-title').value.trim();
  document.getElementById('p-m2-dear').textContent = `Dear ${document.getElementById('m2-dear').value.trim()},`;
  document.getElementById('p-m2-body').textContent = cleanParagraphs(document.getElementById('m2-body').value);
}

function updatePreview() {
  renderMethod1();
  renderMethod2();
  els.content.style.setProperty('--letter-offset', `${state.offset}px`);
  localStorage.setItem('letterOffset', String(state.offset));
}

function shiftLetter(delta) {
  state.offset += delta;
  updatePreview();
}

function setMethod(method) {
  state.method = method;
  els.methodTabs.forEach(btn => btn.classList.toggle('active', btn.dataset.method === method));
  els.method1.classList.toggle('hidden', method !== 'method1');
  els.method2.classList.toggle('hidden', method !== 'method2');
  els.preview1.classList.toggle('hidden', method !== 'method1');
  els.preview2.classList.toggle('hidden', method !== 'method2');
}

els.methodTabs.forEach(btn => {
  btn.addEventListener('click', () => setMethod(btn.dataset.method));
});

document.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', updatePreview);
});

function waitForPageImages(page) {
  const images = Array.from(page.querySelectorAll('img'));
  return Promise.all(images.map(img => {
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  }));
}

async function downloadPdf() {
  const title = state.method === 'method1'
    ? document.getElementById('m1-title').value.trim()
    : document.getElementById('m2-title').value.trim();
  const filename = `${(title || 'letter').toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`;
  const pages = Array.from(els.stack.querySelectorAll('.letter'));

  els.pdfBtn.disabled = true;
  els.pdfBtn.textContent = 'Preparing PDF...';
  document.body.classList.add('exporting');

  try {
    await document.fonts.ready;
    const PdfClass = window.jspdf?.jsPDF || window.jsPDF;
    const pdf = new PdfClass('p', 'mm', 'a4');

    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index];
      await waitForPageImages(page);

      const canvas = await html2canvas(page, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        width: page.offsetWidth,
        height: page.offsetHeight,
        windowWidth: page.offsetWidth,
        windowHeight: page.offsetHeight
      });

      const image = canvas.toDataURL('image/png');
      if (index > 0) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.addImage(image, 'PNG', 0, 0, 210, 297);
    }

    pdf.save(filename);
  } finally {
    document.body.classList.remove('exporting');
    els.pdfBtn.disabled = false;
    els.pdfBtn.textContent = 'Download PDF';
  }
}

els.pdfBtn.addEventListener('click', downloadPdf);

els.moveUp.addEventListener('click', () => shiftLetter(-10));
els.moveDown.addEventListener('click', () => shiftLetter(10));
els.addPage.addEventListener('click', () => {
  const page = document.createElement('div');
  page.className = 'letter';
  page.innerHTML = `
    <img class="letterhead" src="/static/letterhead.jpg" alt="SmartSportz letterhead">
  `;
  els.stack.appendChild(page);
});
els.removePage.addEventListener('click', () => {
  const pages = els.stack.querySelectorAll('.letter');
  if (pages.length > 1) {
    pages[pages.length - 1].remove();
  }
});

updatePreview();
setMethod('method1');

const params = new URLSearchParams(window.location.search);
if (params.get('method') === 'method2') {
  setMethod('method2');
}

if (params.get('autoDownload') === '1') {
  window.addEventListener('load', () => {
    setTimeout(() => els.pdfBtn.click(), 1000);
  });
}
