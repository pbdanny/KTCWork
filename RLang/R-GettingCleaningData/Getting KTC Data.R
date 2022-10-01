setwd("/Users/Danny/Share Win7")

# read data with package 'base'
# dat.old <- read.delim("cc15.txt", quote = "", stringsAsFactors = FALSE)

# Read data by package readr
file <- "qry_ALLProduct_KPI_Export.txt"
if(file.exists(file)) {
  library(readr)
  guess_encoding(file)  # Guess encoding for information
  dat <- read_tsv(file)
  detach("package:readr", unload = TRUE)
}
rm(file)
# Function convert int to char with max nchar of each row

intToChar <- function(x, charWidth = 0) {
  if (is.character(x)) {  # if x already is char then do nothing
    return(x)
  } else {
    maxnchar <- max(nchar(x))  # find middle lenght of the vector
    ifelse(charWidth == 0, charWidth <- maxnchar, NULL)  # if not defind char width to convert, use max char
    return(formatC(x, width = charWidth, format = "d", flag = "0"))  # Flag = 0 : leading 0
  }
}

# Convert interger to string
colIntToChar <- c("AMSup", "Agent_Code", "ZipCode", "Month", "Criteria_Code", "Application_ID")
dat[colIntToChar] <- lapply(dat[colIntToChar], FUN = intToChar)

# Convert Customer DOB to date
# dat$BirthDate <- as.Date(dat$DOB,format = "%d-%m-%Y", origin = "1899-12-30") 
# dat$DOB <- NULL

# Save to data set
setwd("/Users/Danny/Documents/R Project/KTC Dataset")
save(dat, file = "qry_ALLProduct_KPI.Rdata")
