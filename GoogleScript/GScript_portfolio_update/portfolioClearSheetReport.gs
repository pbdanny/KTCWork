/*
* Access all sheet & remove old data
* Parameter : SpreadSheetID
* Output : NA
*/

function clearSheetReport(SSId) {
// hard coded for test
//var SSId = SpreadsheetApp.openById('1GYwAaZDgJ7OkRIiRU9BQJCmziZB-laSC89V6HqguMlQ');
  
  // clear 'cc'
  SSId.getSheetByName('cc').getRange('B2').clearContent();
  SSId.getSheetByName('cc').getRange('B4:E15').clearContent();
  
  // clear 'cc-TL'
  SSId.getSheetByName('cc-TL').getRange('B2').clearContent();
  var rowNum = SSId.getSheetByName('cc-TL').getDataRange().getNumRows();
  var colNum = SSId.getSheetByName('cc-TL').getDataRange().getNumColumns();
  SSId.getSheetByName('cc-TL').getRange(4, 1, rowNum, colNum).clearContent();
  
  // clear 'proud'
  SSId.getSheetByName('proud').getRange('B2').clearContent();
  SSId.getSheetByName('proud').getRange('B4:E15').clearContent();
  
  // clear 'proud-TL'
  SSId.getSheetByName('proud-TL').getRange('B2').clearContent();
  var rowNum = SSId.getSheetByName('proud-TL').getDataRange().getNumRows();
  var colNum = SSId.getSheetByName('proud-TL').getDataRange().getNumColumns();
  SSId.getSheetByName('proud-TL').getRange(4, 1, rowNum, colNum).clearContent();  
}

