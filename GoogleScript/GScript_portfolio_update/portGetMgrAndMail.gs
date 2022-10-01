/*
* Find matched 'AMSup' in data array, return data as specificed
* Parameter : AMSup, Array [][], number of index column to be extracted 
* Output : Object of {mgrCode, advisorMail, mgrMail}
*/

function getMgrAndMail(AMSup, dataArray, colIdx1, colIdx2, colIdx3) {
//  Hard Code for testing
//  var dataArray = readAdvisorData("Advisor Data - Test");
//  var AMSup = '1130';
//  var colIdx1 = 2;
//  var colIdx2 = 21;
//  var colIdx3 = 22;

  
  // If Case for any colIdx_ error cast, then re-assign varible
  if(colIdx1 === undefined || colIdx1 < 0 || colIdx1 > dataArray[0].length) {colIdx1 = 0;}
  if(colIdx2 === undefined || colIdx2 < 0 || colIdx2 > dataArray[0].length) {colIdx2 = 0;}
  if(colIdx3 === undefined || colIdx3 < 0 || colIdx3 > dataArray[0].length) {colIdx3 = 0;}
  
  if(isNaN(colIdx1)) {colIdx1 = Number(colIdx1);}
  if(isNaN(colIdx2)) {colIdx2 = Number(colIdx2);}
  if(isNaN(colIdx3)) {colIdx3 = Number(colIdx3);}
  
  // Define output object
  var outData = {};
  
  for (row in dataArray) {
    if (AMSup == dataArray[row][6]) {
      outData['mgrCode'] = dataArray[row][colIdx1];
      outData['advisorMail'] = dataArray[row][colIdx2];
      outData['mgrMail'] = dataArray[row][colIdx3];
    }
  }
  
  // Logger.log(AMSup + " " + outData['mgrCode'] + " " + outData['advisorMail'] + " " + outData['mgrMail']);
  
  return outData;
}


