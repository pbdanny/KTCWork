/*
* Details : Get latest Daily Sup/AM Performance report form email:atiwat.t@ktc.co.th, then convert to Google Spreadsheet.
* After convert, delete eexcel file and move file to folder 'OS Weekly Diamond Tracking'
* Parameter : email sender, searich patstern, destination folder
* Return : id of SpreadSheet Sup/AM report
*/

function getMailConvertSheetToSaveFolder(emailSender, searchPattern, saveFolderName ) {

  Logger.log("Start function getMailDataCopyToSaveFolder");
  Logger.log("Email sender : " + emailSender);
  Logger.log("Search Pattern : " + searchPattern);
  Logger.log("Save to folder : " + saveFolderName);
  
  // Create Gmail search query style and get seach result the top most one (index = 0) and get only 1 mail
  var searchString = 'from:(' + emailSender + ') Subject:("' + searchPattern + '")'
  var threads = GmailApp.search(searchString, 0, 1); 
  
  // Access array of thread[0]
  Logger.log(threads[0].getFirstMessageSubject()); 

  // Access array of messsage[0], get array of attachment
  var attach = threads[0].getMessages()[0].getAttachments(); 
  
  Logger.log(attach);

  // Output result to Log
  var i = 0; //There is only one attachement in email, then hardcoded atttachment index to 0
  Logger.log("Attachment idx : " + i);
  Logger.log("Attachment name : " + attach[i].getName());
  Logger.log("Attachment type : " + attach[i].getContentType());
  Logger.log("Is Google type : " + attach[i].isGoogleType());

  // Access folder to store report
  var saveFolder = DriveApp.getFoldersByName(saveFolderName).next();
  
  // Save original file to folder 
  var excel = saveFolder.createFile(attach[i].copyBlob())
      
  // Use the Advanced Drive API to upload the Excel file to Drive
  // convert = true will convert the file to the corresponding Google Docs format  
  
  var uploadFile = JSON.parse(UrlFetchApp.fetch(
    "https://www.googleapis.com/upload/drive/v2/files?uploadType=media&convert=true", 
    {
      method: "POST",
      contentType: excel.getMimeType(),
      payload: excel.getBlob().getBytes(),
      headers: {
        "Authorization" : "Bearer " + ScriptApp.getOAuthToken()
      },
      muteHttpExceptions: true
    }
  ).getContentText());
  
  // Return link of converted file
  Logger.log('Upload & convert complete, link : ' + uploadFile.alternateLink);
  
  // Create SpreadSheet file name from the excel file name by remove .xls from
  var ssFileName = excel.getName().substr(0, excel.getName().lastIndexOf("."));
  
  // Create SpreadSheet from converted file and rename
  var ssFile = DriveApp.getFileById(uploadFile.id).setName(ssFileName);
  
  // add SheetSheet file to save folder
  saveFolder.addFile(ssFile);
  
  // Clear Excel Data files
  saveFolder.removeFile(excel);
  Logger.log("Remove Excel Source File");
  
  // Remove converted file in root drive
  DriveApp.removeFile(DriveApp.getFileById(uploadFile.id));
  Logger.log("Remove SpreadSheet Converted files");
  
  // Return file id of SpreadSheetFile
  return ssFile.getId();
}
