// ===== MCN Sample Tracker - GAS backend =====
// Sheet "Master": dòng 1 là header, tên cột phải trùng y hệt key dùng trong Index.html
// (VD: "Số IMEI / SKU", "Tên Sample / Model", "Account PIC", "Trạng thái hiện tại", ...)

const SHEET_NAME = 'Master';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('MCN Sample Tracker - Metub')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

function getSheet_() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('Không tìm thấy sheet "' + SHEET_NAME + '"');
  return sh;
}

// Trả về toàn bộ dữ liệu. Date được format thành chuỗi yyyy-MM-dd vì
// google.script.run không truyền được object Date (cả kết quả sẽ thành null).
function getAllData() {
  const sh = getSheet_();
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return { master: [] };

  const header = values[0].map(h => String(h).trim());
  const tz = Session.getScriptTimeZone();
  const master = values.slice(1)
    .filter(r => r[0] !== '')
    .map(r => {
      const obj = {};
      header.forEach((h, i) => {
        const v = r[i];
        obj[h] = v instanceof Date ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : String(v);
      });
      return obj;
    });
  return { master: master.reverse() }; // dòng mới nhất lên đầu
}

// Thêm 1 log mới, map theo tên cột header
function addSample(rec) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = getSheet_();
    const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => String(h).trim());
    const row = header.map(h => (rec[h] !== undefined && rec[h] !== null) ? rec[h] : '');
    sh.appendRow(row);
    return 'OK';
  } finally {
    lock.releaseLock();
  }
}
