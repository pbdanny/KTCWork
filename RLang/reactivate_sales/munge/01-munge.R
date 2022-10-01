# Data manipulations
# Highlight and run command below do load project without munging.
# This is useful when debugging data manipulation code.
# rm(list = ls()); library(ProjectTemplate); load.project(list(munging=FALSE)) 

# It is often useful to create sets of variable names
# By convention, the list that stores these variable sets is called 'v'
# v <- list()

# edit datafame name according to preferred style
check_oss <- check.oss
rm(check.oss)
colnames(check_oss) <- make.names(colnames(check_oss))
check_oss$OpenDate <- strptime(check_oss$OpenDate, format = "%d/%m/%Y %H:%M:%S")
check_oss$OpenDate <- as.POSIXct(check_oss$OpenDate)

colnames(perf) <- make.names(colnames(perf))

sales_cw <- sales.cw
rm(sales.cw)
colnames(sales_cw) <- make.names(colnames(sales_cw))
sales_cw[sales_cw$Status == "c",]$Status <- "C"
