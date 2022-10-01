/*
* Access Data SpreadSheet and Sheet specified then return value all whole Sheet
* Parameter : SpreadSheet name, Sheet name
* Output : Array [][] of whole Sheet data
*/

function readReportData(dataFileName, sheetName) {
  
  // var sheetName = 'advisor';
  var advisorDataFileId = DriveApp.getFilesByName(dataFileName).next().getId();
  var ss = SpreadsheetApp.openById(advisorDataFileId);
  var sheet = ss.getSheetByName(sheetName)
  var range = sheet.getDataRange();
  var dataArray = range.getValues();
  // Logger.log(dataArray);
  
  return dataArray;
}

