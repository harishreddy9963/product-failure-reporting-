const form = document.getElementById('report-form');
const zoneSelect = document.getElementById('zone');
const divisionSelect = document.getElementById('division');
const stationSelect = document.getElementById('station');
const messageDiv = document.getElementById('message');

const STORAGE_KEY = 'medhaFaultReports';
const STATION_METADATA_SHEET = {
  id: '1809f_a0TxwWUdu7tWr9104WjCPiquXOy2W557gUWFPE',
  gid: '0'
};

let locationData = [
  {
    zone: 'Northern Railway',
    divisions: [
      {
        division: 'Delhi Division',
        stations: ['New Delhi', 'Hazrat Nizamuddin', 'Anand Vihar']
      },
      {
        division: 'Firozpur Division',
        stations: ['Ludhiana', 'Amritsar', 'Jalandhar City']
      }
    ]
  },
  {
    zone: 'North Eastern Railway',
    divisions: [
      {
        division: 'Varanasi Division',
        stations: ['Varanasi Junction', 'Jaunpur City', 'Gorakhpur']
      },
      {
        division: 'Lucknow Division',
        stations: ['Lucknow NR', 'Bareilly', 'Moradabad']
      }
    ]
  }
];

function normalizeHeader(header) {
  return (header || '').toString().trim().toLowerCase();
}

function parseSheetRows(table) {
  const cols = table.cols.map(col => normalizeHeader(col.label || col.id || ''));
  return table.rows.map(row => {
    const item = {};
    row.c.forEach((cell, index) => {
      const key = cols[index] || `col${index}`;
      item[key] = cell && cell.v != null ? cell.v : '';
    });
    return item;
  });
}

function buildLocationDataFromSheet(rows) {
  const zones = {};
  rows.forEach(row => {
    const zone = row.zone || row.Zone || row.ZONE || row['Zone'] || row['zone'];
    const division = row.division || row.Division || row.DIVISION || row['Division'] || row['division'];
    const station = row.station || row.Station || row.STATION || row['Station'] || row['station'] || row['Station Name'] || row['station name'] || row['STATION NAME'];
    if (!zone || !division || !station) return;

    if (!zones[zone]) {
      zones[zone] = { zone, divisions: {} };
    }
    if (!zones[zone].divisions[division]) {
      zones[zone].divisions[division] = new Set();
    }
    zones[zone].divisions[division].add(station);
  });

  return Object.values(zones).map(zoneEntry => ({
    zone: zoneEntry.zone,
    divisions: Object.entries(zoneEntry.divisions).map(([division, stationSet]) => ({
      division,
      stations: Array.from(stationSet).sort()
    }))
  }));
}

async function loadLocationMetadata() {
  const url = `https://docs.google.com/spreadsheets/d/${STATION_METADATA_SHEET.id}/gviz/tq?tqx=out:json&gid=${STATION_METADATA_SHEET.gid}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const jsonText = text.replace(/^[\s\S]*?\(/, '').replace(/\);?\s*$/, '');
    const data = JSON.parse(jsonText);
    const rows = parseSheetRows(data.table);
    const sheetLocationData = buildLocationDataFromSheet(rows);
    if (sheetLocationData.length) {
      locationData = sheetLocationData;
      return true;
    }
  } catch (err) {
    console.warn('Station metadata load failed:', err);
  }
  return false;
}

function fillZones() {
  zoneSelect.innerHTML = '<option value="">Select Zone</option>';
  locationData.forEach(item => {
    const option = document.createElement('option');
    option.value = item.zone;
    option.textContent = item.zone;
    zoneSelect.appendChild(option);
  });
}

function fillDivisions(zoneName) {
  divisionSelect.innerHTML = '<option value="">Select Division</option>';
  stationSelect.innerHTML = '<option value="">Select Station</option>';

  const zone = locationData.find(item => item.zone === zoneName);
  if (!zone) return;

  zone.divisions.forEach(item => {
    const option = document.createElement('option');
    option.value = item.division;
    option.textContent = item.division;
    divisionSelect.appendChild(option);
  });
}

function fillStations(zoneName, divisionName) {
  stationSelect.innerHTML = '<option value="">Select Station</option>';
  const zone = locationData.find(item => item.zone === zoneName);
  const division = zone?.divisions.find(item => item.division === divisionName);
  if (!division) return;

  division.stations.forEach(station => {
    const option = document.createElement('option');
    option.value = station;
    option.textContent = station;
    stationSelect.appendChild(option);
  });
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message show ${type}`;
  setTimeout(() => {
    messageDiv.className = 'message';
  }, 4000);
}

function saveLocal(formData) {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    arr.push(formData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    return true;
  } catch (e) {
    console.error('Failed to save locally', e);
    return false;
  }
}

zoneSelect.addEventListener('change', event => {
  fillDivisions(event.target.value);
});

divisionSelect.addEventListener('change', () => {
  fillStations(zoneSelect.value, divisionSelect.value);
});

form.addEventListener('submit', event => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  if (!data.reportingName || !data.zone || !data.station || !data.description) {
    showMessage('Please fill in all required fields.', 'error');
    return;
  }

  data.submittedAt = new Date().toLocaleString();

  const ok = saveLocal(data);
  if (ok) {
    showMessage('Report saved locally.', 'success');
    form.reset();
    divisionSelect.innerHTML = '<option value="">Select Division</option>';
    stationSelect.innerHTML = '<option value="">Select Station</option>';
  } else {
    showMessage('Failed to save report locally.', 'error');
  }
});

// ---- Admin inline modal handling ----
const adminButton = document.getElementById('admin-menu-button');
const adminModal = document.getElementById('admin-modal');
const adminModalClose = document.getElementById('admin-modal-close');
const adminInlineForm = document.getElementById('admin-inline-form');

const ADMIN_USER = 'ADMIN';
const ADMIN_PASS = 'Medha9167';

function openAdminModal() {
  adminModal.classList.remove('hidden');
  adminModal.setAttribute('aria-hidden', 'false');
}

function closeAdminModal() {
  adminModal.classList.add('hidden');
  adminModal.setAttribute('aria-hidden', 'true');
}

adminButton.addEventListener('click', openAdminModal);
adminModalClose.addEventListener('click', closeAdminModal);

adminInlineForm.addEventListener('submit', event => {
  event.preventDefault();
  const fd = new FormData(adminInlineForm);
  const user = fd.get('adminUser')?.trim();
  const pass = fd.get('adminPass')?.trim();
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem('medhaAdminAuth', 'true');
    closeAdminModal();
    window.location.href = 'admin-responses.html';
    return;
  }
  alert('Invalid admin credentials');
});

(async () => {
  await loadLocationMetadata();
  fillZones();
})();
