/*
* Details : Get latest Daily Rcvd report form email:atiwat.t@ktc.co.th, then convert to Google Spreadsheet.
* After convert 
* Parameter : None
* Return : None
*/

function getMailDataCopyToReport() {

  // search Report in Gmail query style the latest 1
  var threads = GmailApp.search('from:(atiwat.t@ktc.co.th) subject:("OS Daily & MTD App Rcvd")', 0, 1); 
  
  // Access array of thread[0]
  Logger.log(threads[0].getFirstMessageSubject()); 

  // Access array of messsage[0], get array of attachment
  var attach = threads[0].getMessages()[0].getAttachments(); 
  
  Logger.log(attach);
  /* In case of many attachements in mail
  *  Loop all attahcement to find the needed attachment.
  */
  /*
  for (i = 0; i < attach.length; i++) {
    Logger.log(attach[i].getName());
    if (attach[i].getName().indexOf('OSS') > -1) {  // Look up array of attachment with name contain 'OSS'
      break;
    }
  }
  */
  
  // Output result to Log
  var i = 0; //There is only one attachement in email, then hardcoded atttachment index to 0
  Logger.log("Attachment idx : " + i);
  Logger.log("Attachment name : " + attach[i].getName());
  Logger.log("Attachment type : " + attach[i].getContentType());
  Logger.log("Is Google type : " + attach[i].isGoogleType());

  // Access folder to store report
  var saveFolder = DriveApp.getFoldersByName('OS Weekly Advisor Ranking').next();
  
  // Save original file to folder 
  var file = saveFolder.createFile(attach[i].copyBlob())
      
  // Use the Advanced Drive API to upload the Excel file to Drive
  // convert = true will convert the file to the corresponding Google Docs format  
  
  var uploadFile = JSON.parse(UrlFetchApp.fetch(
    "https://www.googleapis.com/upload/drive/v2/files?uploadType=media&convert=true", 
    {
      method: "POST",
      contentType: file.getMimeType(),
      payload: file.getBlob().getBytes(),
      headers: {
        "Authorization" : "Bearer " + ScriptApp.getOAuthToken()
      },
      muteHttpExceptions: true
    }
  ).getContentText());
  
  // Return result file Log file
  Logger.log('Upload & convert complete, link : ' + uploadFile.alternateLink);
  
  // Copy data from converted Spreadsheet to target Spreadsheet
  
  // Source data
  // var sheetFile = DriveApp.getFiles;
  var ssData = SpreadsheetApp.openById(uploadFile.id);
  Logger.log("Source File : " + ssData.getName());

  var sheetData = ssData.getSheetByName("Daily App Rcvd");
  Logger.log("Retrived data from Sheet : " + sheetData.getName());

  var rangeData = sheetData.getDataRange();
  var A1Range = rangeData.getA1Notation();

  Logger.log("Data Range : " + A1Range);
  var sourceData = rangeData.getValues();
  
  // Target sheet 'Daily Rcvd', if not available then create one
  var ssTarget = SpreadsheetApp.openById("1WaJxyACy6kml8_bJ0ZiLegiOqt4ADh2knn2FgDKKaqU");
  if (ssTarget.getSheetByName("Daily Rcvd") == null) {
    ssTarget.insertSheet("Daily Rcvd", 0);
  }
  
  // Clear Sheet advisorData and copy from original 
  var ssAdvisorDataSource = SpreadsheetApp.openById("1R6zCAx6N9qBUh4t_ra7uilwKDuq2LWL4mH_Iyx-rxog");
  var dataArray = ssAdvisorDataSource.getActiveSheet().getDataRange().getValues();
  var dataRowNum = dataArray.length;
  var dataColNum = dataArray[0].length;
  
  Logger.log("Retrive Advisor Data from : " + ssAdvisorDataSource.getSheetName() + 
    " \n Range : " +  ssAdvisorDataSource.getActiveSheet().getDataRange().getA1Notation());
  Logger.log("Advisor Data size " + dataRowNum + " x " + dataColNum);
  
  var sheetAdvisorDataTarget = ssTarget.getSheetByName("advisorData");
  sheetAdvisorDataTarget.clearContents();  //Clear old Advisor data target
  sheetAdvisorDataTarget.getRange(1, 1, dataRowNum, dataColNum).setValues(dataArray);  //Copy data from source Advisor Data
  
  // Copy source Data to target data
  var sheetTarget = ssTarget.getSheetByName("Daily Rcvd");
  sheetTarget.clear();
  sheetTarget.getRange(A1Range).setValues(sourceData);
  Logger.log("Copy from SpreadSheet :"+ ssData.getName() + " - Sheet : " + sheetData.getSheetName() + 
    " \n to SpreadSheet : " + ssTarget.getName() + " - Sheet : " + sheetTarget.getSheetName());
  
  // Clear Excel Data files
  saveFolder.removeFile(file);
  Logger.log("Remove Excel Source File");
  
  // Remove converted file in root drive
  DriveApp.removeFile(DriveApp.getFileById(uploadFile.id));
  Logger.log("Remove SpreadSheet Converted files");
}

/*
* Details : Copy data from source sheet to template sheet
* Parameter : None
* Output : Object of {Report date, working day, total working day}
*/

function clearTemplateAndCopyTo(){

  // Open Template Spreadsheet 
  var ss = SpreadsheetApp.openById(("1WaJxyACy6kml8_bJ0ZiLegiOqt4ADh2knn2FgDKKaqU"));
  
  // Get sheet name 'Summary'
  var sheetData = ss.getSheetByName('Daily Rcvd');
  Logger.log("Open Sheet Name : " + sheetData.getSheetName()); 
    
  // Get report information : WD Passed
  var workingDay = sheetData.getRange("IK1").getValue();
  Logger.log("Working day passed : " + workingDay);
  
  // Get report information : Total WD in month 
  var totalWorkingDay = sheetData.getRange("IK2").getValue();
  Logger.log("Total Working day in Month : " + totalWorkingDay);
  
  // Get report information : Report Date
  var reportDate = sheetData.getRange("A2").getValue().split(":")[1].trim();
  Logger.log("Report Date : " + reportDate);

  // clear old data form template
  var sheetReport = ss.getSheetByName("rank-rcvd");
  sheetReport.getRange(2, 1, 150, 4).clearContent();
  
  // Copy from sheet Summary to Sheet Appr
  sheetData.getRange("C8:C115").copyTo(sheetReport.getRange("A2"), {contentsOnly:true}); // SupCode
  sheetData.getRange("D8:D115").copyTo(sheetReport.getRange("B2"), {contentsOnly:true});  // Name
  sheetData.getRange("HO8:HO115").copyTo(sheetReport.getRange("C2"), {contentsOnly:true});  // MTD Rcvd
  sheetData.getRange("II8:II115").copyTo(sheetReport.getRange("D2"), {contentsOnly:true});  // Avg / WD
  
  sheetReport.getRange("G2").setValue(reportDate); // report data
  sheetReport.getRange("G3").setValue(workingDay);  // report wd
  sheetReport.getRange("G4").setValue(totalWorkingDay);  // total wd in month
  
  return {reportDate : reportDate,
          workingDay : workingDay,
          totalWorkingDay : totalWorkingDay};
}

/*
* Details : Filter row without name (blank) then copy to template for sorting
* Parameter : none
* Output : Sorted template data
*/

function sortTemplate() {
  // Open Template Spreadsheet 
  var ss = SpreadsheetApp.openById(("1WaJxyACy6kml8_bJ0ZiLegiOqt4ADh2knn2FgDKKaqU"));
  var sheetReport = ss.getSheetByName("rank-rcvd");
  var lastRow = sheetReport.getLastRow();
  // Logger.log("Last Row : " + lastRow);
  
  // Define data Range
  var dataRange = sheetReport.getRange(2, 1, lastRow-1, 5);  // start at row 2, column 1 to lastrow -1, to column 5 
  Logger.log("Data Range : " + dataRange.getA1Notation());
  
  // Pused script for Sheet update
  // Utilitis.sleep(0);
  
  // Loop all data and remove blank row with blank value in 2nd column
  // Save data in new varible
  var data = dataRange.getValues();
  var newData = new Array();
  
  // Loop and check if blank
  for (i in data) {
    var row = data[i]  // row data 
    if (row[1].length != 0) {  // check if 2nd column is blank or not
      newData.push(row);
    }
  }
  Logger.log("Number of row without blank :  " + newData.length);
  
  // 
  // Loop newData for osData / keyData / tsData
  var osData = new Array();
  var tsData = new Array();
  var keyData = new Array();
  for (i in newData) {
    var row = newData[i];
    if (row[4] == "OSS") {
      osData.push(row);
    } else if (row[4] == "Key") {
      keyData.push(row);
    } else if (row[4] == "TS") {
      tsData.push(row);
    }
  }
  
  // At J2 : clear old data & store new osData
  sheetReport.getRange(2, 10, 115, osData[0].length).clearContent();
  var targetRange = sheetReport.getRange(2, 10, osData.length, osData[0].length);
  targetRange.setValues(osData);
  // Sort targetRange by colomn 9th
  targetRange.sort({column: 12, ascending: false});
  
  // At Q2 : clear old data and store keyData
  sheetReport.getRange(2, 17, 10, osData[0].length).clearContent();
  var targetRange = sheetReport.getRange(2, 17, keyData.length, keyData[0].length); 
  targetRange.setValues(keyData);
  // Sort targetRange by colomn 9th
  targetRange.sort({column: 19, ascending: false});
   
  // At Q16 : clear old data and store tsData
  sheetReport.getRange(16, 17, 10, osData[0].length).clearContent();
  var targetRange = sheetReport.getRange(16, 17, tsData.length, tsData[0].length); 
  targetRange.setValues(tsData);
  // Sort targetRange by colomn 9th
  targetRange.sort({column: 19, ascending: false});
  
  return {os : sheetReport.getRange("O2:O91").getValues(),
          key : sheetReport.getRange("V2:V6").getValues(),
          ts : sheetReport.getRange("V16:V18").getValues()
         }
}

function weeklyRcvdRank() {
  getMailDataCopyToReport();
  var reportData = clearTemplateAndCopyTo();
  var reportDate = reportData['reportDate'];
  var data = sortTemplate();
  var file = DriveApp.getFileById("1WaJxyACy6kml8_bJ0ZiLegiOqt4ADh2knn2FgDKKaqU");
  
  // Create body of mail from each sorted data
  var topOS = new Array();
  var topKey = new Array();
  var topTS = new Array();
  
  // OS body
  var rank = data["os"];
  for (var i = 0; i <= 10; i++) {
    topOS.push(rank[i]);
  }
  var bodyOS = topOS.join("\r\n");
  
  // Key Account body
  var bodyKey = data["key"].join("\r\n");
 
  // Telesales body
  var bodyTS = data["ts"].join("\r\n");
  

  GmailApp.sendEmail("thanakrit.b@ktc.co.th", "Advisor Rcvd Ranking data as of " + reportDate,
                     "\n" + "Top MTD App Rcvd " + reportDate + " (" + reportData['workingDay'] + "/"+ reportData['totalWorkingDay'] + " WD) " +
                     "\n \n" + "OSS Top 5 Advisor" + "\n" + bodyOS +
                     "\n \n" + "Key Accout Top Advisor" + "\n" + bodyKey +
                     "\n \n" + "Telesales Top Advisor" + "\n" + bodyTS +
                     "\n \n" + "Log file : " + "\n" + Logger.getLog() +
                     "\n \n" + "Linked to file" + "\n" + "https://docs.google.com/spreadsheets/d/1WaJxyACy6kml8_bJ0ZiLegiOqt4ADh2knn2FgDKKaqU/edit#gid=0", 
                     {name: 'Automatic Emailer Script'});

}
