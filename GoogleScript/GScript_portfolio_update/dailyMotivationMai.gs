/*
* Details : Get latest Credit Card ranking report form email:chatchaphat.c and convert to Google Spreadsheet
* Return : Object of 1. ID of Excel Report, 2. Id of SpreadSheet
*/

function getReport() {

  // search Report in Gmail query style the latest 1
  var threads = GmailApp.search('chatchaphat.t@ktc.co.th subject:"credit card top ranking"', 0, 1); 
  
  // Access array of thread[0]
  Logger.log(threads[0].getFirstMessageSubject()); 

  // Access array of messsage[0], get array of attachment
  var attach = threads[0].getMessages()[0].getAttachments(); 
  
  // Logger.log(attach);
  for (i = 0; i < attach.length; i++) {
    Logger.log(attach[i].getName());
    if (attach[i].getName().indexOf('OSS') > -1) {  // Look up array of attachment with name contain 'OSS'
      break;
    }
  }
  // Output result to Log
  Logger.log("Attachment idx : " + i);
  Logger.log("Attachment name : " + attach[i].getName());
  Logger.log("Attachment type : " + attach[i].getContentType());
  Logger.log("Is Google type : " + attach[i].isGoogleType());

  // Access folder to store report
  var saveFolder = DriveApp.getFoldersByName('OS Daily Motivation Report').next();
  
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
  
  // Remove the file extension from the original file name
  var googleFileName = file.getName().substr(0, file.getName().lastIndexOf("."));
  
  // Update the name of the Google Sheet created from the Excel sheet
  var ss = DriveApp.getFileById(uploadFile.id).setName(googleFileName);
  
  // add Sheet to work folder
  saveFolder.addFile(ss);
  
  // Return fuaction with orifinal file id and sheet id
  return { 'excel' : file.getId(), 'sheet' : ss.getId()};
  
  Logger.log('Upload & convert complete, link : ' + uploadFile.alternateLink);
}

/*
* Details : Calculate motivation Credit Cart Top Ranking from 0 (no) .. to 4 (top)
* Output : Inether of tier
*/

function calMoTier(total) {
  var tier = [];
  for (var i = 0; i < total.length; i++) {
    var score = total[i][0];
    if (score >= 340) { tier[i] = "  มีสิทธิ์ชิง 50000 B!";} 
    else if (score >= 240) { tier[i] = " 30000 B  ทำเพิ่มอีก : "+ (340 - score).toString() + "  มีสิทธิ์ชิง 50000 B"; }
    else if (score >= 140) { tier[i] = " 17000 B  ทำเพิ่มอีก : "+ (240 - score).toString()  + "  มีสิทธิ์ชิง 30000 B"; }
    else if (score >= 100) { tier[i] = " 12000 B  ทำเพิ่มอีก : "+ (140 - score).toString()  + "  มีสิทธิ์ชิง 17000 B"; }
    else { tier[i] = " - B  ทำเพิ่มอีก : "+ (100 - score).toString()  + "  มีสิทธิ์ชิง 12000 บาท"; }
  }
  return tier;
}

/*
* Details : Get Sheet report Id as arguments then return object of totalcc and Supam ranking
* Output : Objeat of array 1. Total cc and rank, 2. Heirachy form Sales Agent to Manager
*/

function getSheetTotalRank(ssId){

  Logger.log("Open SpreadSheet ID : " + ssId);
  
  // Get active sheet
  var sheet = SpreadsheetApp.openById(ssId).getActiveSheet();
  Logger.log("Open Sheet Name : " + sheet.getSheetName());
  Logger.log("Last row with data : " + sheet.getLastRow() + " & Last column with data : " + sheet.getLastColumn());
  
  // Get last row with contents & last column with contents 
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  // Define range of total and rank
  var rangeTotalRank = sheet.getRange(5, lastCol - 1, lastRow - 5, 2);
  
  // Get value for Total and Rank
  var totalRank = sheet.getSheetValues(5, lastCol - 1, 150, 2);  // Retrive only top 150 for faster
  Logger.log("Length of total data : " + totalRank.length);
  Logger.log("First rank total value : " + totalRank[0][1]);
  Logger.log("Last rank total value : " + totalRank[totalRank.length - 1][1]);
  
  // Get value for M, Sup, TL and Agent
  var ref = sheet.getSheetValues(5, 3, lastRow - 5, 4);
  Logger.log("First rank Agent Code : " + ref[0][3].toString() + " under Sup : " + ref[0][1].toString() + " under M : " + ref[0][0].toString());
  
  // return Object of totalRank and ref
  return {'totalRank' : totalRank, 'ref' : ref};
}


/*
* Details : Retrive mailing list from Sheet Daily Mo Report Mail List
* Ouput : mailList
*/
function getMailList() {
  
  // Get access to mailing list files
  var folder = DriveApp.getFoldersByName('OS Daily Motivation Report').next();
  var file = folder.getFilesByName('Daily Mo Report Mail List').next();
  Logger.log('Accessing mailing file : ' + file.getName());
  
  // Get access to Spreadsheet name
  var ss = SpreadsheetApp.openById(file.getId());
  Logger.log("Accessing Sheet : " + ss.getSheetName());
  
  // Get access to Active sheet
  var sheet = ss.getActiveSheet();
  
  // Get mail list
  Logger.log("Retrive data from range : " + sheet.getDataRange().getA1Notation());
  var mailList = sheet.getDataRange().getValues();
  
  return mailList;
}

/* 
* Details : Main function get data and calculated rank
* Ltop through all mailList and loop through result then create top 120 List by Advisor
* Output : Sent mail to Advisor and cc Manager
*/
function main() {
  // Get latest report
  var report = getReport();
  var excel = DriveApp.getFileById(report['excel']).getBlob();
  
  // Get approve CC data
  var data = getSheetTotalRank(report['sheet']);
  var totalRank = data['totalRank'];
  
  // Get hierachy data
  var ref = data['ref'];
  
  // Calculate rank and next rank
  var tier = calMoTier(totalRank);
  
  // Get mailing list data  
  var mailList = getMailList();
  
  // Prepare for sending mail
  var reportDate = new Date(new Date().setDate(new Date().getDate()-1));
  
  // Loop through mail List
  for (var i = 1; i < mailList.length; i++) { // skip header (row 1)
    var msg = ' ';
        
    // Loop through top 120 Agent
    for (var j = 0; j < 120; j++) {
      
      // Check if Advisor Code in mailList?
      if (mailList[i][0] == ref[j][1]) {
        
        // Create message of all Sales agent top 120 by Advisor
        msg = msg.concat("\n Sales Agent : " + ref[j][3] + "\t อยู่ Rank : " + totalRank[j][1] +
                         " \t ผลงาน CC รวม : " + totalRank[j][0] + " \n อยู่ใน Tier : " + tier [j] + "\n \n");        
        // Prepare to sending mail
      }
    } // finish finding ranking data by Advisor
    
    // Create subject & Header
    var subject = "ทดสอบโปรแกรมแจ้ง Top 120 Sales - Super Cash : Credit Card as of " + reportDate.toDateString();
    var advisor = "ทดสอบโปรแกรมแจ้ง Top 120 Sales - Super Cash : Credit Card จากรายงาน Daily ของ Sales Support \n \n" + 
      "Advisor : " + mailList[i][1] + '\n';
    var message = advisor.concat(msg);
      
    Logger.log("Sending mail to : " + mailList[i][2]);
    // Sent mail with cc and attach original report
    GmailApp.sendEmail(mailList[i][2], subject, message, 
                       {cc : mailList[i][4],
                        attachments: excel}
                      );
  } // Finish mail list loop
}
