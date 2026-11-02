/**
 * Placement LMS - Google Sheets backend starter
 * Deploy as Web app only after reviewing access/security requirements.
 * Do not store student passwords in this spreadsheet.
 */
const SPREADSHEET_ID = '1PxYCRtdNP1EoWgxbgIo-rN9rdltX61brTMCnOOs25-0';

function getPlacementSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

const SHEET_NAMES = {
  students: 'Students',
  companies: 'Companies',
  results: 'Test Results',
  attempts: 'Test Attempts',
  technicalResults: 'Technical MCQ Results',
  programmingResults: 'Programming Results',
  drives: 'Placement Drives'
};

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'health';
  let payload;
  try {
    if (action === 'health') payload = { ok: true, message: 'Placement LMS API is running' };
    else if (action === 'list') payload = listRows_(e.parameter.sheet);
    else throw new Error('Unknown action');
  } catch (err) {
    payload = { ok: false, error: String(err.message || err) };
  }
  const callback = e && e.parameter && e.parameter.callback;
  const body = callback ? `${callback}(${JSON.stringify(payload)});` : JSON.stringify(payload);
  return ContentService.createTextOutput(body).setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function doPost(e) {
  let payload;
  try {
    const input = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sheetKey = input.sheet;
    const row = input.row;
    const action = input.action || 'append';
    if (!SHEET_NAMES[sheetKey]) throw new Error('Invalid sheet key');
    const sheet = getPlacementSpreadsheet_().getSheetByName(SHEET_NAMES[sheetKey]);
    if (!sheet) throw new Error('Sheet tab not found: ' + SHEET_NAMES[sheetKey]);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
    const idHeader = sheetKey === 'companies' ? 'Company_ID' : 'Drive_ID';
    if (action === 'delete') {
      const id = String(input.id || '');
      if (!id) throw new Error('Missing record ID');
      const idCol = headers.indexOf(idHeader) + 1;
      if (idCol < 1) throw new Error('ID column not found');
      const values = sheet.getLastRow() > 1 ? sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues() : [];
      for (let i = values.length - 1; i >= 0; i--) if (String(values[i][0]) === id) sheet.deleteRow(i + 2);
      payload = { ok: true, message: 'Record deleted' };
    } else {
      if (!row || typeof row !== 'object') throw new Error('Missing row data');
      const values = headers.map(h => row[h] === undefined ? '' : row[h]);
      if (action === 'upsert') {
        const id = String(row[idHeader] || '');
        const idCol = headers.indexOf(idHeader) + 1;
        let targetRow = 0;
        if (id && idCol > 0 && sheet.getLastRow() > 1) {
          const ids = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues();
          const index = ids.findIndex(item => String(item[0]) === id);
          if (index >= 0) targetRow = index + 2;
        }
        if (targetRow) sheet.getRange(targetRow, 1, 1, headers.length).setValues([values]);
        else sheet.appendRow(values);
      } else sheet.appendRow(values);
      payload = { ok: true, message: 'Record saved' };
    }
  } catch (err) {
    payload = { ok: false, error: String(err.message || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function listRows_(sheetKey) {
  if (!SHEET_NAMES[sheetKey]) throw new Error('Invalid sheet key');
  const sheet = getPlacementSpreadsheet_().getSheetByName(SHEET_NAMES[sheetKey]);
  if (!sheet) throw new Error('Sheet tab not found');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return { ok: true, rows: [] };
  const headers = values.shift();
  return { ok: true, rows: values.filter(r => r.some(v => v !== '')).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]]))) };
}

function setupDatabase() {
  const ss = getPlacementSpreadsheet_();
  const schemas = {
    'Students': ['Student_ID','Name','Roll_Number','Email','Course','Batch','Phone','Created_At'],
    'Companies': ['Company_ID','Company_Name','Programs_Included','Pay_Package','Selections','Status','Remarks','Website','Created_At'],
    'Placement Drives': ['Drive_ID','Company_Name','Website','Registration_Link','Job_Location','Eligible_Programs','Job_Profile','Specialization','Vacancies','Selection_Process','Mode','Cutoff_Class_X','Cutoff_Class_XII','Cutoff_Graduation','Cutoff_PG','Active_Backlogs','CTC_Stipend','Graduation_Details','Created_At'],
    'Test Results': ['Result_ID','Student_ID','Student_Name','Email','Roll_Number','Test_Name','Score','Total_Marks','Percentage','Submitted_At'],
    'Test Attempts': ['Attempt_ID','Student_ID','Test_Name','Start_Time','End_Time','Status'],
    'Technical MCQ Results': ['Result_ID','Student_ID','Student_Name','Email','Roll_Number','Test_ID','Test_Name','Test_Type','Attempt_Number','Score','Total_Questions','Percentage','Started_At','Submitted_At','Duration_Seconds','Auto_Submitted','Answers_JSON','Next_Retest_At'],
    'Programming Results': ['Result_ID','Student_ID','Student_Name','Email','Roll_Number','Test_ID','Test_Name','Test_Type','Attempt_Number','Score','Total_Questions','Percentage','Started_At','Submitted_At','Duration_Seconds','Auto_Submitted','Answers_JSON','Next_Retest_At']
  };
  Object.entries(schemas).forEach(([name, headers]) => {
    let sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0 || sh.getLastColumn() === 0) {
      sh.appendRow(headers);
    } else {
      const existing = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
      const missing = headers.filter(header => !existing.includes(header));
      if (missing.length) sh.getRange(1, sh.getLastColumn() + 1, 1, missing.length).setValues([missing]);
    }
  });
}
function testSaveResult() {
  const testRow = {
    Result_ID: 'TEST-' + Date.now(),
    Student_ID: 'TEST-STUDENT',
    Student_Name: 'Test Student',
    Email: 'test@example.com',
    Roll_Number: 'TEST-001',
    Test_ID: 'test-technical',
    Test_Name: 'Technical Test',
    Test_Type: 'technical',
    Attempt_Number: 1,
    Score: 8,
    Total_Questions: 10,
    Percentage: 80,
    Submitted_At: new Date().toISOString()
  };

  const sheet = getPlacementSpreadsheet_()
    .getSheetByName(SHEET_NAMES.technicalResults);

  if (!sheet) throw new Error('Technical Test Result tab not found');

  const totalMarks = testRow.Total_Questions;
  const values = HEADERS.map(header => {
    if (header === 'Total_Marks') return totalMarks;
    if (header === 'Total_Questions') return totalMarks;
    return testRow[header] ?? '';
  });

  sheet.appendRow(values);
}