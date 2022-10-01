# -------------
# Basic Web scrapping
# ------------

## 1 Basic url command

con <- url("http://www.imdb.com/title/tt1490017/")  # Create url connection
html <- readLines(con)  # Read line by line
close(con)
hlike <- grep("like", html, value = FALSE)  # Output as a index of vector
html[hlike]  # Show the match data

## 2 XML package

library(XML)
url <- "http://www.imdb.com/title/tt1490017/"
html <- htmlTreeParse(url, useInternalNodes = TRUE)  # Scrap data with parse from XML to html node
title <- xpathSApply(html, "//title")  # Search through the html data node for node <title>
rating <- xpathSApply(html, "//strong//span")   # Search through the html data node <title> sub node <span>
title; rating

## 3 httr package
library(httr)
con <- GET(url)  # Create connector information 
content <- content(con, as = "text")  # Scraping connection in text mode
prasedhtml <- htmlParse(content, asText = TRUE)  # Prase text to html node
title <- xpathSApply(prasedhtml, "//title")  
rating <- xpathSApply(prasedhtml, "//strong//span")  
title; rating

## 4 rvest package
library(rvest)
html <- read_html("http://www.imdb.com/title/tt1490017/")  # create html connnector
title <- html %>%  
  html_node("title") %>%  # Search through for node name <title>
  html_text()  #  Extract text inside the node

rating <- html %>%
  html_node("strong span") %>%   # Search through for node name <title>, sub node <span>
  html_text() %>%  # Extract text inside the node
  as.numeric()
rating


## ---------------------
## Advance data loading 
## ---------------------

# 1 Stock data with quantmod package

library(quantmod)
getSymbols("BEM.BK", scr = "yahoo")  # Auto create dataframe name as stock symbol
HTC.TW <- getSymbols("2498.TW", scr = "yahoo", auto.assign = FALSE)  # Store data in defined dataframe
barChart(BEM.BK, theme = "white", multi.col = TRUE, subset = "2016")  # Create bar chart subset only year 2016
candleChart(BEM.BK, theme = "white", multi.col = TRUE, subset = "2016")  # Create candle chart subset only year 2016
addMACD()  # Add MACD chart


# 2 Google sheet data with googlesheet package

library(googlesheets)
gsList <- gs_ls()  # Create authentication & get list of google sheets
glimpse(gsList)  # show google sheet summary info
gsBooth <- gs_title("Booth Tracking")  # link googlesheet connection with booth
gs_browse(gsBooth)  # Open browser and show data
boothDF <- gs_read(gsBooth, ws = "Booth-Tracking")  # Read google sheet to dataframe


# 3 GIS data with rgdal
library(sp)
library(rgdal)
GdataDir <- "/Users/Danny/Documents/R Project/R-GIS-data/AmphoeTempShapefile"  # Directorry of GIS data
layerName <- "AmphoeTempMaximum"  # Define shapefile as layer to be loaded : this is Max Temp by Amphoe
gData <- readOGR(dsn = GdataDir, layer = layerName)  # Load data into R
plot(dData)  #plot the data in GIS
max <- max(gData@data$X2001_04)  # Find max temp in April, 2001
min <- min(gData@data$X2001_04[gData@data$X2001_04 > 0])  # Find min temp in April, 2001 (subset temp = -9999)
gData$Name..NUN.[gData$X2001_04 == max]  # Show Amphor name with max temp
gData$Name..NUN.[gData$X2001_04 == min]  # Show Amphor name with min temp

# 3.1 GIS admin data
GdataDir <- "/Users/Danny/Documents/R Project/THA_adm"  # Directory of Thai Administration shape file
layerName <- "THA_adm1"  # Load Thai Province layer from shape (.shp)
gData <- readOGR(dsn = GdataDir, layer = layerName)  # Load data into R
plot(gData)

## ----------------------------------------
## Data manipulation with dplyr and tidyr
## ----------------------------------------

# Read-in the data from Excel files
library(readxl)
ytd <- read_excel("/Users/Danny/Downloads/YTD Sales Performance  as of Jan-May 2016.xls", sheet = "OSS")
detach(package:readxl)

# Do data frame preparation
names(ytd) <- make.names(names(ytd))  # Rename with function make.names
ytd <- ytd[!is.na(ytd$Agent_Code), ]  # Remove last total row which agent code = NA
ytd$ClosedDate <- as.Date(ytd$ClosedDate, origin = "1899-12-30")  # Convert ClosedDate from numeric to Date object 

# Convert data from complex wide format to long format

library(dplyr)
library(tidyr)

salesYTD <- ytd %>%
  select(Agent_Code, starts_with("New")) %>% # Select Agent_code and column start with "New"
  gather(Month_Product, Approved, starts_with("New")) %>%  # Convert wide format to long format all column start with "New"
  separate(Month_Product, c("New", "Product", "Month")) %>%  # Separate column Month_Product to 3 column new month and product 
  select(-New) %>%  # Remove column New which not used
  # create YYYYMM column form 
  # Abbriviate month (Jan, Feb..) convert to number by match widh month.abb
  # Add leading Zero with formatC flag = "0"
  # Paste with YYYY = 2016
  mutate(YYYYMM = paste0("2016", formatC(match(Month, month.abb), width = 2 , format = "d", flag = "0"))) %>%
  filter(match(Month, month.abb) <= 5)  # Last month update is May

# Recreate complex wide format

# 1. Summary data in wide format

wide <- salesYTD %>%
  select(-YYYYMM) %>%
  mutate(Month = match(Month, month.abb)) %>%  # Convert Month to numeric
  unite(col = Product_Month, Product, Month, remove = TRUE) %>%  # Create Column Name = Product_Month
  spread(key = Product_Month, value = Approved)  # Create wide format

# 2. Create YTD Varible
wide <- wide %>% 
  mutate(CC_YTD = apply(wide[,grepl("^CC", names(wide))], 1, FUN = sum))  %>%  # YTD CC data
  mutate(FIX_YTD = apply(wide[,grepl("^FIX", names(wide))], 1, FUN = sum)) %>%  # YTD FIX data
  mutate(REV_YTD = apply(wide[,grepl("^REV", names(wide))], 1, FUN = sum)) %>%  # YTD REV data
  mutate(TT_YTD = apply(wide[,-1], 1, FUN = sum))  # YTD Total

# 3. Create Agent data header
agentHead <- ytd %>%
  select(1:11)

# 4. Combine and creae report
report <- wide %>%
  left_join(agentHead) %>%
  arrange(desc(TT_YTD))

# 5. Re-suffle column order 
report <- report[,c(21:25, 1, 26:30, 2:20)]
