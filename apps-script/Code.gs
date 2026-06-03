function doPost(e) {
  try {
    var requestBody = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    var sheetId = 'YOUR_SPREADSHEET_ID';
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName('Reports');
    if (!sheet) {
      sheet = SpreadsheetApp.openById(sheetId).insertSheet('Reports');
      sheet.appendRow([
        'Timestamp',
        'Reporting Name',
        'Designation',
        'Contact Number',
        'Email',
        'Zone',
        'Division',
        'Station',
        'Fault Type',
        'Severity',
        'Description',
        'Report Date',
        'Additional Comments'
      ]);
    }

    sheet.appendRow([
      new Date(),
      requestBody.reportingName || '',
      requestBody.designation || '',
      requestBody.contactNumber || '',
      requestBody.email || '',
      requestBody.zone || '',
      requestBody.division || '',
      requestBody.station || '',
      requestBody.faultType || '',
      requestBody.severity || '',
      requestBody.description || '',
      requestBody.reportDate || '',
      requestBody.additionalComments || ''
    ]);

    return jsonResponse({ success: true, message: 'Report saved successfully.' });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message });
  }
}

function doGet() {
  return jsonResponse({ success: true, message: 'Google Sheet fault report endpoint is live.' });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}
