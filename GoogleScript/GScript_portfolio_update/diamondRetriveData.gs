/*
* Details : use retrieved data from source file in to Report files
* Parameter : Object data
* Output : none
*/

function putDataToReport(dataObject) {
  
  var ss = SpreadsheetApp.openById('1AQDBz7Ra4S5knnDS587b0dIgdJJxilYec8PJtw5NQ9s') // 'Summary Diamond Performance Report id';
  var dataSheet = ss.getSheetByName("Data");
  
  dataSheet.clearContents();  // Clear content
  
  // Initialized header
  dataSheet.getRange("A1").setValue("Report Date");
  dataSheet.getRange("A2").setValue("WD");
  dataSheet.getRange("A3").setValue("Total WD");
  dataSheet.getRange("A4:C4").setValues([["SupCode","CCN","RL"]]);
  
  // Put data in postion
  dataSheet.getRange("B1").setValue(dataObject['reportDate'][1]);
  dataSheet.getRange("B2").setValue(dataObject['WD'][1]);  
  dataSheet.getRange("B3").setValue(dataObject['totalWD'][1]);  

  dataSheet.getRange(5, 1, dataObject['supAM'][1].length, 1).setValues(dataObject['supAM'][1]);
  dataSheet.getRange(5, 2, dataObject['ccN'][1].length, 1).setValues(dataObject['ccN'][1]);
  dataSheet.getRange(5, 3, dataObject['RL'][1].length, 1).setValues(dataObject['RL'][1]);
  
  
}

