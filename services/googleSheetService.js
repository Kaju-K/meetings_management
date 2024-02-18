const { google } = require("googleapis");

const credentials = JSON.parse(process.env.credentials);

const readGoogleSheet = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });
  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.spreadsheetId,
    range: "Events!A:C"
  });

  return getRows.data;
};

const clearGoogleSheet = async (startIndex, endIndex) => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  await googleSheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.spreadsheetId,
    // range: `Events!${range}`,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: "ROWS",
              startIndex,
              endIndex
            }
          }
        }
      ]
    }
  });
};

const writeGoogleSheet = async (data) => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId: process.env.spreadsheetId,
    range: "Events!A:C",
    valueInputOption: "RAW",
    resource: {
      values: data
    }
  });
};

module.exports = { readGoogleSheet, clearGoogleSheet, writeGoogleSheet };
