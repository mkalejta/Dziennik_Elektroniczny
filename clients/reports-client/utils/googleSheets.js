const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../google/service-account.json'),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.readonly'
  ]
});

async function getSheetTitles(sheetId) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const res = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  return res.data.sheets.map(s => s.properties.title);
}

async function createSheetIfNotExists(sheetId, sheetTitle) {
  const titles = await getSheetTitles(sheetId);
  if (!titles.includes(sheetTitle)) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: sheetTitle }
            }
          }
        ]
      }
    });
    console.log(`Utworzono arkusz: ${sheetTitle}`);
  }
}

async function clearSheet(sheetId, sheetTitle) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range: `${sheetTitle}!A:Z`
  });
}

async function appendToSheet(sheetId, values, sheetTitle = 'Sheet1') {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetTitle}!A1`,
    valueInputOption: 'RAW',
    requestBody: {
      values
    }
  });

  console.log(`Wysłano ${values.length} wierszy do arkusza ${sheetTitle}.`);
}

async function downloadSheetAsXlsx(sheetId, filepath) {
  const client = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: client });

  // Pobierz plik jako XLSX
  const res = await drive.files.export(
    {
      fileId: sheetId,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    { responseType: 'stream' }
  );

  // Zapisz do pliku
  const dest = fs.createWriteStream(filepath);
  await new Promise((resolve, reject) => {
    res.data.pipe(dest);
    res.data.on('end', resolve);
    res.data.on('error', reject);
  });
}

module.exports = { appendToSheet, createSheetIfNotExists, clearSheet, downloadSheetAsXlsx };
