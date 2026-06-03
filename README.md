# Shareable Railway Fault Report Form

This folder contains a standalone fault report form that can save submissions directly to Google Sheets via a Google Apps Script web app.

## Files

- `index.html` — the shareable form page
- `styles.css` — form styling
- `script.js` — sends form data to Google Sheets
- `apps-script/Code.gs` — sample Apps Script code to deploy as a web app

## Setup Steps

### 1. Create a Google Sheet

1. Open Google Sheets and create a new spreadsheet.
2. Rename the first sheet to `Reports`.
3. Note the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`

### 2. Create the Apps Script endpoint

1. In the spreadsheet, go to `Extensions` → `Apps Script`.
2. Replace the default code with the contents of `apps-script/Code.gs`.
3. Replace `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID.
4. Save the script.

### 3. Deploy as a web app

1. In Apps Script, click `Deploy` → `New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set `Who has access` to `Anyone` or `Anyone, even anonymous`.
5. Deploy and copy the Web App URL.

### 4. Configure the form

1. In `google-sheet-form/script.js`, replace:
   ```js
   const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';
   ```
   with the Web App URL you copied.
2. Save the file.

### 5. Share the form

- Open `google-sheet-form/index.html` in a browser.
- Share the HTML file or host it on GitHub Pages, Netlify, or any static file server.
- Anyone who opens the page can submit a report and the data is appended automatically to your Google Sheet.

## How it works

- The form collects railway fault report details.
- `script.js` sends those details to the Google Apps Script endpoint.
- The Apps Script appends each submission as a new row to the `Reports` sheet.

## Notes

- Make sure the web app permission is set to allow public access.
- If the form shows an error, verify the URL and that the Apps Script deployment is active.
