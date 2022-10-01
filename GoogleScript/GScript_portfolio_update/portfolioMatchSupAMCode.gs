/*
* Find matched 'AMSup' in data array, return with stripped column as specificed
* Parameter : AMSup, Array [][], number of index column to be extracted 
* Output : Array [][]
*/


function matchAMSup(AMSup, dataArray, returnColIdx) {
//  Hard Code for testing
//  var advisorRLDataArray = readReportData("Share RL Portfolio - Data","advisor");
//  var AMSup = '1130';
//  var dataArray = advisorRLDataArray;
//  var returnColIdx = 100;
  
  
  // If Case for any returnColIdx error cast, then re-assign varible
  if(returnColIdx === undefined) {returnColIdx = 0;}
  if(isNaN(returnColIdx)) {returnColIdx = Number(returnColIdx);}
  if(returnColIdx > dataArray[0].length) {returnColIdx = 0;}
  if(returnColIdx < 0) {returnColIdx = 0;} 
   
  var outData = [];
  for (row in dataArray) {
    if (AMSup == dataArray[row][0]) {
      outData.push(dataArray[row].slice(returnColIdx));
    }
  }
//  Logger.log(outData[0].length);
//  Logger.log(outData);
  
  return outData;
}

