// Written by Amit Agarwal www.ctrlq.org
// Email: amit@labnol.org

function convertDocuments() {
  
  // Convert xlsx file to Google Spreadsheet
  convertToGoogleDocs_("Excel File.xlsx")

  // Convert .doc/.docx files to Google Document
  convertToGoogleDocs_("Microsoft Word Document.doc")

  // Convert pptx to Google Slides
  convertToGoogleDocs_("PowerPoint Presentation.pptx")

}

// By Google Docs, we mean the native Google Docs format
function convertToGoogleDocs_(fileName) {
  
  var officeFile = DriveApp.getFilesByName(fileName).next();
  
  // Use the Advanced Drive API to upload the Excel file to Drive
  // convert = true will convert the file to the corresponding Google Docs format
  
  var uploadFile = JSON.parse(UrlFetchApp.fetch(
    "https://www.googleapis.com/upload/drive/v2/files?uploadType=media&convert=true", 
    {
      method: "POST",
      contentType: officeFile.getMimeType(),
      payload: officeFile.getBlob().getBytes(),
      headers: {
        "Authorization" : "Bearer " + ScriptApp.getOAuthToken()
      },
      muteHttpExceptions: true
    }
  ).getContentText());
  
  // Remove the file extension from the original file name
  var googleFileName = officeFile.substr(0, officeFile.lastIndexOf("."));
  
  // Update the name of the Google Sheet created from the Excel sheet
  DriveApp.getFileById(uploadFile.id).setName(googleFileName);
  
  Logger.log(uploadFile.alternateLink);  
}
