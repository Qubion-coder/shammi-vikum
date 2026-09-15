/**
 * Google Apps Script Web App for Wedding RSVP + Wishes
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1R906ThMeilKDVmPFSzm_24veP438peyt8SWp1wb2gEQ/edit?usp=sharing
 *
 * Required sheets:
 * - rsvp
 * - wish
 */

const SPREADSHEET_ID = "1R906ThMeilKDVmPFSzm_24veP438peyt8SWp1wb2gEQ";
const RSVP_SHEET_NAME = "rsvp";
const WISH_SHEET_NAME = "wish";

function doPost(e) {
  return handleRequest_(e);
}

function doGet(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    const params = parseParams_(e);
    const action = String(params.action || "").trim().toLowerCase();

    if (!action) {
      return jsonResponse_({ ok: false, message: "Missing action" });
    }

    if (action === "rsvp") {
      return jsonResponse_(saveRsvp_(params));
    }

    if (action === "wish") {
      return jsonResponse_(saveWish_(params));
    }

    return jsonResponse_({ ok: false, message: "Invalid action" });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error && error.message ? error.message : "Unexpected error",
    });
  }
}

function saveRsvp_(params) {
  const sheet = getSheet_(RSVP_SHEET_NAME);

  ensureHeader_(sheet, [
    "timestamp",
    "name",
    "place",
    "guests",
    "attendance",
    "dietaryNotes",
  ]);

  const name = String(params.name || "").trim();
  const place = String(params.place || "").trim();
  const attending = String(params.attending || "").trim();
  const guests = String(params.guests || "").trim();
  const dietaryNotes = String(params.dietaryNotes || "").trim();

  if (!name) {
    return { ok: false, message: "Name is required" };
  }

  const attendance = attending === "no" ? "Declined" : "Attending";

  sheet.appendRow([
    new Date(),
    name,
    place,
    guests || "1",
    attendance,
    dietaryNotes,
  ]);

  return { ok: true, message: "RSVP saved" };
}

function saveWish_(params) {
  const sheet = getSheet_(WISH_SHEET_NAME);

  ensureHeader_(sheet, ["timestamp", "name", "message"]);

  const name = String(params.name || "").trim();
  const message = String(params.message || "").trim();

  if (!name || !message) {
    return { ok: false, message: "Name and message are required" };
  }

  sheet.appendRow([new Date(), name, message]);

  return { ok: true, message: "Wish saved" };
}

function getSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

function ensureHeader_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}

function parseParams_(e) {
  const params = Object.assign({}, (e && e.parameter) || {});

  if (!(e && e.postData && e.postData.contents)) {
    return params;
  }

  const contents = String(e.postData.contents || "").trim();
  if (!contents) {
    return params;
  }

  if (contents.charAt(0) === "{") {
    const json = JSON.parse(contents);
    return Object.assign(params, json);
  }

  const parsed = parseFormEncoded_(contents);
  return Object.assign(params, parsed);
}

function parseFormEncoded_(raw) {
  const result = {};
  const pairs = String(raw || "").split("&");

  for (var i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    var parts = pairs[i].split("=");
    var key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
    var value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
    if (key) {
      result[key] = value;
    }
  }

  return result;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
