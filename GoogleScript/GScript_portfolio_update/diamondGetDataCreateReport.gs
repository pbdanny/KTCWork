function main() {
  
  // get and convert sup am report to google Spreadsheet
  var fileId = getMailConvertSheetToSaveFolder("atiwat.t@ktc.co.th", "OS Sup/AM Performance", "OS Weekly Diamond Tracking");
  
  // Define sheetName, rangeArray
  var sheetName = 'Summary';
  var sourceObject = {
    reportDate : 'A2',
    WD : 'AF1',
    totalWD : 'AF2',
    supAM : 'C8:C125',
    ccN : 'R8:R125',
    RL : 'AB8:AB125'
  };
  
  var dataObject = extractSpreadSheetData(fileId, sheetName, sourceObject);

  putDataToReport(dataObject);

  GmailApp.sendEmail("thanakrit.b@ktc.co.th", "Diamond weekly report as of " + dataObject['reportDate'][1],
                     "\n \n" + "Linked to report file" + 
                     DriveApp.getFileById('1AQDBz7Ra4S5knnDS587b0dIgdJJxilYec8PJtw5NQ9s').getUrl() +
                     "\n \n" + "Linked to sup am file" +
                     "\n \n" + DriveApp.getFileById(fileId).getUrl() +
                     "\n \n Log file \n \n" + Logger.getLog() , 
                     {name: 'Automatic Emailer Script'});
}


