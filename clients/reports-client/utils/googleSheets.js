const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../google/service-account.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

async function appendToSheet(sheetId, values) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values
    }
  });

  console.log(`Wysłano ${values.length} wierszy do arkusza Google Sheets.`);
}

module.exports = { appendToSheet };
