/*
* Details : Scraping data a from Google Spreadsheet.
* Parameter : SpreadSheet fileID, Sheet name , object of A1Notation data needed 
* Return : object of named array with data output
*/

function extractSpreadSheetData(fileId, sheetName, sourceObject) {
//  // Hard code SpreadSheet file id for testting
//  var fileId = '1o4p1WyJL0TLRDElIydHnABzYdrFzebymjm7Sl3igpwA';
//  // Hard code sheetName, rangeArray for testting
//  var sheetName = 'Summary';
//  var sourceObject = {
//    reportDate : 'A2',
//    WD : 'AF1',
//    totalWD : 'AF2',
//    supAM : 'C8:C125',
//    ccN : 'R8:R125',
//    RL : 'AB8:AB125'
//  };
  
  // Access SpreadSheet with SpreadSheetApp
  var ss = SpreadsheetApp.openById(fileId);
  
  // Access Sheet with name parameter
  var sheet = ss.getSheetByName(sheetName);
  
  // Loop all sourceObject to get data from range definded
  var dataObject = {};
  for (i in sourceObject) {
    
    // check if reange defined in sourceObject contain ':' , if so use getValues for ranged data [][]
    // use regex with pattern /:/.test(String) = regex test String with parameter inside /.../
    // create output data as array of source range and data

    if (/:/.test(sourceObject[i])) {
      dataObject[i] = [sourceObject[i], sheet.getRange(sourceObject[i]).getValues()];  // In case sourceData are range data use getValues()
    } else {
      if (/reportDate/.test(i)) {  // For key 'reportDate' extracting Date part only
        var extractDate = sheet.getRange(sourceObject[i]).getValue().split(":")[1].trim();  // splite with ':' then use the 2nd string with trim()
        dataObject[i] = [sourceObject[i], extractDate];
      } else {
        dataObject[i] = [sourceObject[i], sheet.getRange(sourceObject[i]).getValue()];
      }
    }
  }
  return dataObject;
}

