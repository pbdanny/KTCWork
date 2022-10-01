getwd()
setwd("/Volumes/Danny_Seagate/Backup/OSS & TS - Performance/2016/Complain 2015 - Mar 2016")

library(xlsx)
fileXLSX <- "ลูกค้าร้องเรียน_2015.xlsx"
dat <- read.xlsx2(file = fileXLSX, sheetIndex = 2, startRow = 2, stringsAsFactors = FALSE)
comp1 <- dat[,c(2,7,31)]

fileXLSX2 <- "ลูกค้าร้องเรียน_2016_CFC.xls"
dat2 <- read.xlsx2(file = fileXLSX2, sheetIndex = 1, startRow = 2, stringsAsFactors = FALSE)
comp2 <- dat2[,c(2,7,31)]

comp <- rbind(comp1,comp2)
rm(list = c("comp1","comp2"))

names(comp) <- c("Date","CustName","AgentCode")
comp$Date <- as.Date(as.numeric(comp$Date), origin = "1899-12-30")

detach("package:xlsx", unload = TRUE)

grep("ชิดโชค",comp$CustName)
agent <- read.delim("DataAllTypeTeam_201603.txt", stringsAsFactors = FALSE)
agent$Agent_Code <- as.character(agent$Agent_Code)

library(dplyr)

t <- left_join(x = comp, y = agent, by = c("AgentCode" = "Agent_Code"))

t.sum <-t %>%
  group_by(AMSup, AMSup.NAME, year(Date), month(Date)) %>%
  summarise(noComp = n()) %>%
  filter(!is.na(AMSup))

write.csv(t.sum, file = "advisorComp.csv", row.names = FALSE)
