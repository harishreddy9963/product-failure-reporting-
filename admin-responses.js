// Admin responses viewer (local-only)
const AUTH_FLAG = 'medhaAdminAuth';
const STORAGE_KEY = 'medhaFaultReports';

function ensureAuth() {
  if (sessionStorage.getItem(AUTH_FLAG) !== 'true') {
    window.location.href = 'admin.html';
  }
}

function renderTable(rows) {
  const head = document.getElementById('responses-head');
  const body = document.getElementById('responses-body');
  head.innerHTML = '';
  body.innerHTML = '';

  if (!rows || !rows.length) {
    document.getElementById('status').textContent = 'No responses available.';
    return;
  }

  const keys = Object.keys(rows[0]);
  keys.forEach(k => {
    const th = document.createElement('th');
    th.textContent = k;
    head.appendChild(th);
  });

  rows.forEach(row => {
    const tr = document.createElement('tr');
    keys.forEach(k => {
      const td = document.createElement('td');
      td.textContent = row[k] ?? '';
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

function loadResponses() {
  const raw = localStorage.getItem(STORAGE_KEY) || '[]';
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length) {
      renderTable(arr);
      return;
    }
  } catch (e) {
    console.error('Failed to parse localStorage responses', e);
  }

  document.getElementById('status').textContent = 'No responses found. Submit the form to add a response.';
}

document.getElementById('logout').addEventListener('click', () => {
  sessionStorage.removeItem(AUTH_FLAG);
  window.location.href = 'admin.html';
});

ensureAuth();
loadResponses();
