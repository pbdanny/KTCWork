library(RODBC)

file <- "F:/Backup/OSS & TS - Performance/2015/OSSDatabaseNew.accdb"
con <- odbcConnectAccess2007(file)

odbcGetInfo(con)
tableList <- sqlTables(con)

cc15 <- sqlFetch(con, tableList$TABLE_NAME[97])

dat <- cc15[cc15$Month %in% c("201510","201511","201512"), ]
dat <- dat[dat$TL_Code %in% c("5550084","5550093","5550103","5550109","5550114","5550116"), ]
dat$active45 <- dat$NewCC == 1 & dat$No_Transaction_Date >= 1 & dat$No_Transaction_Date <= 60

dat$active45[is.na(dat$active45)] <- 0

aggregate(x = dat["active45"], by = dat["No_Transaction_Date"], FUN = sum)
agg <- aggregate(x = dat[c("NewCC","active45")], by = dat[c("TL_Code","Month")], FUN = sum)

write.csv2(agg, file = "active45.csv")

# ----------------------
# 2016
# ----------------------


file <- "F:/Backup/OSS & TS - Performance/2016/2016OSSDatabase.accdb"
con <- odbcConnectAccess2007(file)

odbcGetInfo(con)
tableList <- sqlTables(con)

cc16 <- sqlFetch(con, tableList$TABLE_NAME[88])

dat <- cc16[cc16$Month %in% c("201601"), ]
dat <- dat[dat$TL_Code %in% c("5550084","5550093","5550103","5550109","5550114","5550116"), ]
dat$active45 <- dat$NewCC == 1 & dat$No_Transaction_Date >= 1 & dat$No_Transaction_Date <= 60

dat$active45[is.na(dat$active45)] <- 0

aggregate(x = dat["active45"], by = dat["No_Transaction_Date"], FUN = sum)
agg <- aggregate(x = dat[c("NewCC","active45")], by = dat[c("TL_Code","Month")], FUN = sum)
