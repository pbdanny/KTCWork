/*
* Convert column from Array[][] to vector with option for unique output
* Parameter : Array[][] named as Matrix, column index for extraction, output as unique or not
* Output : Array[]
*/

function getUniqueAMSup() {
  var advisorRLDataArray = readReportData("Share RL Portfolio - Data","advisor");
  
  // output Array[]
  var amSup = [];
  
  // Define i = 1 to skip header row
  for(i = 1; i < advisorRLDataArray.length ; i++) {
    amSup.push(advisorRLDataArray[i][0]);
  }
  
  // Filter unique data array
  var out = amSup.filter(onlyUnique);
  
  // Logger.log(amSup);
  // Logger.log(out);
  return out;
}

/* 
* Helper function to find value in Array
* If find, then return true
*/

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
