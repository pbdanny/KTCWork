/*
* Access all cc and rl data, filter by supam, then return result
* Parameter : AMSup
* Output : Object {AMSup , advisorRL, tlRL, advisorCC, tlCC}
*/


function readAllReportData(AMSup) {

// Hard Code part for testing  
//  var AMSup = '1130';
  
  // Read Adisor RL Data
  var advisorRLDataArray = readReportData("Share RL Portfolio - Data","advisor");
  // Logger.log(advisorRLDataArray);
  var advisorRLFilter = matchAMSup(AMSup, advisorRLDataArray, 2);
  // Logger.log(advisorRLFilter);
  
  // Read Advisor-TL RL data
  var advisorTLRLDataArray = readReportData("Share RL Portfolio - Data","advisorTL");
  // Logger.log(advisorTLRLDataArray);
  var advisorTLRLFilter = matchAMSup(AMSup, advisorTLRLDataArray, 1);
  // Logger.log(advisorTLRLFilter);
  
  
  // Read Advisor CC Data
  var advisorCCDataArray = readReportData("Share CC Portfolio - Data","advisor");
  // Logger.log(advisorCCDataArray);
  var advisorCCFilter = matchAMSup(AMSup, advisorCCDataArray, 2);
  // Logger.log(advisorCCFilter);
  
  // Read Advisor-TL CC Data
  var advisorTLCCDataArray = readReportData("Share CC Portfolio - Data","advisorTL");
  // Logger.log(advisorTLCCDataArray);
  var advisorTLCCFilter = matchAMSup(AMSup, advisorTLCCDataArray, 1);
  // Logger.log(advisorTLCCFilter); 
  
  
  return {
    AMSup : AMSup,
    advisorRL : advisorRLFilter,
    tlRL : advisorTLRLFilter,
    advisorCC : advisorCCFilter,
    tlCC : advisorTLCCFilter
  };
}

