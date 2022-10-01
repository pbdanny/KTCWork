/*
* Access all Report Id & paste data in each field
* Parameter : data object from readAllReport data & SpreadSheetID
* Output : NA
*/

function pasteSheetReport(data, SSId) {
// hard coded for test
// var SSId = SpreadsheetApp.openById('14yONRZkvRvvNtRIwyiGMt9nTOHdMp9BpM8pmd-RrXqo');
// var data = readAllReportData('1130');

  // paste 'cc'
  SSId.getSheetByName('cc').getRange('B2').setValue(data['AMSup']);
  SSId.getSheetByName('cc').getRange('B4:E15').setValues(data['advisorCC']);
  
  // paste 'cc-TL'
  SSId.getSheetByName('cc-TL').getRange('B2').setValue(data['AMSup']);
  // find number of row and column
  // var numRow = countObjRow(data['tlCC']);
  // var numCol = countObjCol(data['tlCC']);
  // Logger.log(numRow + " " + numCol);
  SSId.getSheetByName('cc-TL').getRange(4, 1, countObjRow(data['tlCC']), countObjCol(data['tlCC'])).setValues(data['tlCC']);
  
  // clear 'proud'
  SSId.getSheetByName('proud').getRange('B2').setValue(data['AMSup']);
  SSId.getSheetByName('proud').getRange('B4:E15').setValues(data['advisorRL']);
  
  // clear 'proud-TL'
  SSId.getSheetByName('proud-TL').getRange('B2').clearContent();
  SSId.getSheetByName('proud-TL').getRange(4, 1, countObjRow(data['tlRL']), countObjCol(data['tlRL'])).setValues(data['tlRL']);
}

/*
* Helper function find no. of row and no. of column
* in Object data
* Output : No row , no col
*/

function countObjRow(obj) {
  var row = 0;
  for (i in obj) {
    row++;
  }
  return row;
}

function countObjCol(obj) {
  return obj[0].length;
}

