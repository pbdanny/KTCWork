/*
* Access Advisor Data
* Parameter : None
* Output : Array [][] of advisor data
*/

function readAdvisorData(fileName) {
  // hard coded for testing
  // var fileName = "Advisor Data - Test";
  var advisorDataFileId = DriveApp.getFilesByName(fileName).next().getId();
  var ss = SpreadsheetApp.openById(advisorDataFileId);
  var sheet = ss.getActiveSheet();
  var range = sheet.getDataRange();
  var dataArray = range.getValues();
  // Logger.log(dataArray);
  
  return dataArray;
}
