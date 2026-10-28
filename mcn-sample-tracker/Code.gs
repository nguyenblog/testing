/**
 * BACKEND GOOGLE APPS SCRIPT CHO MCN SAMPLE MANAGEMENT
 * Author: Trung Nguyên
 */

const SHEET_MASTER = 'Sample_Tracking_Master';
const SHEET_ACCOUNTS = 'Danh_Sach_Sample_Theo_Account';
const SHEET_WORKFLOW = 'Quy_Trinh_Working_Flow';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('MCN Sample Management System')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

// Chuẩn hóa giá trị ô trước khi trả về client:
// google.script.run không truyền được object Date (cả kết quả sẽ thành null),
// nên Date được đổi thành chuỗi yyyy-MM-dd để Index.html so sánh hạn SLA.
function toClientValue_(value, tz) {
  if (value instanceof Date) return Utilities.formatDate(value, tz, 'yyyy-MM-dd');
  if (value === null || value === undefined) return '';
  return String(value);
}

// Đọc header dòng 1, bỏ khoảng trắng thừa (VD: "Mã dự án " -> "Mã dự án")
function getHeaders_(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
}

// Lấy toàn bộ dữ liệu từ các sheet để đổ ra giao diện web
function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tz = ss.getSpreadsheetTimeZone();

  const getSheetData = (sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return [];
    const headers = rows[0].map(h => String(h).trim());
    return rows.slice(1)
      .filter(row => row.some(cell => cell !== '')) // bỏ dòng trống
      .map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          if (header) obj[header] = toClientValue_(row[index], tz);
        });
        return obj;
      });
  };

  return {
    master: getSheetData(SHEET_MASTER).reverse(), // dòng mới nhất lên đầu cho mục "Gần đây"
    accounts: getSheetData(SHEET_ACCOUNTS),
    workflow: getSheetData(SHEET_WORKFLOW)
  };
}

// Thêm dòng mới vào Master Tracking từ Web App.
// `data` có key là tên cột (VD: "Số IMEI / SKU", "Hạn hoàn trả (SLA)") nên
// giá trị được ghi đúng cột theo header, không phụ thuộc thứ tự cột trong sheet.
function addMasterRecord(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // tránh 2 người lưu cùng lúc ghi đè lẫn nhau
  } catch (e) {
    return { success: false, message: 'Hệ thống đang bận, vui lòng thử lại.' };
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_MASTER);
    if (!sheet) return { success: false, message: 'Không tìm thấy sheet ' + SHEET_MASTER };

    const headers = getHeaders_(sheet);
    if (headers.length === 0) return { success: false, message: 'Sheet Master chưa có dòng header' };

    const record = Object.assign({}, data);
    if (!record['Ngày xuất khỏi kho']) record['Ngày xuất khỏi kho'] = new Date();

    const row = headers.map(h => (record[h] !== undefined && record[h] !== null) ? record[h] : '');
    sheet.appendRow(row);

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  } finally {
    lock.releaseLock();
  }
}
