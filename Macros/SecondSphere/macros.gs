// git: https://github.dev/jahands/Notion-Icon-Cache-AppsScript

// Scripts sharing this code:
// https://script.google.com/home/projects/18KGVC-6U2h5oPmLVK55xZ9J8wQVeq3iJDEF0rvnMPkqVcZaRor82Mxl0/edit

function Merge() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getActiveRange().mergeVertically();
};

function MergeBulk() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getCurrentCell().offset(0, 0, 2, 1).activate()
    .mergeVertically();
  for(let i=0; i<50; i++){
    spreadsheet.getCurrentCell().offset(2, 0, 2, 1).activate()
  .mergeVertically();
  }
};