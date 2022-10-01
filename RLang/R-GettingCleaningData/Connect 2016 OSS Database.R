getwd()
setwd("F:/Backup/OSS & TS - Performance/2016")
list.files()
f <- list.files()
file <- f[grepl("accdb", f)]

library(RODBC)
con <- odbcConnectAccess2007(file)
t <- sqlTables(con)

## ---------------
# Sales & TL Data
## ---------------
saleDF <- sqlFetch(con, "DataAllTypeTeam_201605", stringsAsFactors = FALSE, as.is = TRUE)
names(saleDF) <- make.names(names(saleDF))  # Edit colname
# Convert Opendata form text to Date
saleDF["OpenDate"] <- lapply(saleDF["OpenDate"], FUN = function(x) {
  as.Date(x, origin = "1899-12-30")
  })

checkTL <- saleDF[saleDF$Agent_Code == 4442753,]
checkSalesTL <- saleDF[saleDF$TL_Code == 4442753,]
odbcCloseAll()


# Product Data
# ccDf <- sqlFetch(con, "MIS_CC_OS_Data_15", stringsAsFactors = FALSE)
# cus <- ccDf[grepl("ไพรสันต์", ccDf$Thai_Name) & ccDf$Result == "A",]

library(dplyr)
saleDF <- tbl_df(saleDF)
salesNipha <- saleDF %>%
  filter(M_NAME == "Nipha") %>%
  distinct(M, M_NAME, AMSup, AMSup.NAME, TL_Code, TL_Name, Agent_Code, Agent_Name)

library(xlsx)
write.xlsx2(as.data.frame(salesNipha), 
            file = "F:/Backup/OSS - Disclose Sales Data/salesNipha.xlsx", 
            row.names = FALSE, showNA = FALSE)

## -----------------------
## Select table structure
## -----------------------
setwd("D:/Share P Noi")
g <- list.files()
file2 <- g[grepl("201605.mdb", g)]
con2 <- odbcConnectAccess(file2)
t2 <- sqlTables(con2)
t2l <- grepl("MIS", t2$TABLE_NAME)
y <- t2[t2l, "TABLE_NAME"]
co2 <- sqlColumns(con2, "MIS_RL_OS_Data_60_2016")
View(co2)
co2str <- co[,3:7]
sum(costr$COLUMN_NAME != co2str$COLUMN_NAME)


detach(package:RODBC) "MIS_RL_OS_Data_60_2016")
View(co2)
co2str <- co[,3:7]
sum(costr$COLUMN_NAME != co2str$COLUMN_NAME)


detach(package:RODBC)
