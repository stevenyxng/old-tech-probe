/**
 * Old Tech, Close to Home — upload endpoint
 *
 * Paste this into the Apps Script editor of a Google Sheet
 * (Sheet > Extensions > Apps Script), then deploy as a web app.
 * Each submission saves the photo to a Drive folder and adds a row to the Sheet.
 */

const FOLDER_NAME = 'Old Tech Probe - Photos';
const SHEET_NAME = 'Responses';
const HEADERS = [
  'Received at', 'Participant', 'Prompt #', 'Prompt ID', 'Prompt',
  'Caption', 'Photo link', 'Photo file name', 'Sent from device at'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const participant = String(data.participant || '').replace(/[^\w-]/g, '').slice(0, 40) || 'unknown';
    const promptId = String(data.promptId || 'prompt').replace(/[^\w-]/g, '').slice(0, 60);

    let fileUrl = '';
    let fileName = '';
    if (data.image) {
      const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
      fileName = participant + '_' + String(data.promptNumber || '').padStart(2, '0') + '_' + promptId + '_' + stamp + '.jpg';
      const blob = Utilities.newBlob(Utilities.base64Decode(data.image), 'image/jpeg', fileName);
      const file = getParticipantFolder_(participant).createFile(blob);
      fileUrl = file.getUrl();
    }

    getSheet_().appendRow([
      new Date(),
      participant,
      data.promptNumber || '',
      promptId,
      String(data.promptText || ''),
      String(data.caption || ''),
      fileUrl,
      fileName,
      String(data.clientTime || '')
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web-app URL in a browser shows this, so you can confirm it's live.
function doGet() {
  return ContentService.createTextOutput('The probe upload endpoint is running.');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function getRootFolder_() {
  const found = DriveApp.getFoldersByName(FOLDER_NAME);
  return found.hasNext() ? found.next() : DriveApp.createFolder(FOLDER_NAME);
}

// One subfolder per participant keeps the photos organized.
function getParticipantFolder_(participant) {
  const root = getRootFolder_();
  const found = root.getFoldersByName(participant);
  return found.hasNext() ? found.next() : root.createFolder(participant);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: run this once from the editor (select it, click Run) to approve
 * permissions and create the Sheet headers and Drive folder ahead of time.
 */
function setup() {
  getSheet_();
  getRootFolder_();
}
