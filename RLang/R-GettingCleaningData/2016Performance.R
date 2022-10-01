getwd()
setwd("F:/Backup/OSS & TS - Performance/2016")
accessFile <- "2016OSSDatabase.accdb"

library(RODBC)
con <- odbcConnectAccess2007(accessFile)
sqlTables(con)

ccdf <- sqlFetch(con, "qry_CC_KPI", stringsAsFactors = FALSE, as.is = TRUE)

odbcCloseAll()
detach(package:RODBC)
rm(list = c("accessFile", "con"))

library(dplyr)
library(tidyr)

cctbl <- tbl_df(ccdf)
names(cctbl) <- make.names(names(ccdf))

cctbl <- cctbl %>%
  mutate_each(funs(as.numeric), No_Transaction_Date, spending, AGE)

TT <- cctbl %>%
  filter(Channel == "Booth-BKK" | Channel == "Booth-UPC") %>%
  group_by(AMSup.NAME) %>%
  summarise(TT = n())

advBranch <- cctbl %>%
  filter(Channel == "Booth-BKK" | Channel == "Booth-UPC") %>%
  group_by(AMSup.NAME, Branch_Code) %>%
  summarise(n = n()) %>%
  spread(key = Branch_Code, value = n) %>%
  left_join(TT)

write.csv(advBranch, file = "AdvisorByBranch.csv", row.names = FALSE)
