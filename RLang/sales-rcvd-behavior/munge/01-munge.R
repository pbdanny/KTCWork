# Data manipulations
# Highlight and run command below do load project without munging.
# This is useful when debugging data manipulation code.
# rm(list = ls()); library(ProjectTemplate); load.project(list(munging=FALSE)) 

# It is often useful to create sets of variable names
# By convention, the list that stores these variable sets is called 'v'
# v <- list()

# remove unused column
# oss_rcvd$system_date <- NULL
# oss_rcvd$diff_date <- NULL

# convert date_char to date

colnames(oss_rcvd) <- tolower(names(oss_rcvd))
oss_rcvd$date <- as.Date(oss_rcvd$receive_date, format = "%d/%m/%Y %H:%M:%S")
oss_rcvd$day_of_week <- weekdays(oss_rcvd$date, abbreviate = TRUE)
oss_rcvd$no_week_of_year <- as.integer(format(oss_rcvd$date, format = "%W"))
oss_rcvd$month <- format(oss_rcvd$date, format = "%m")
oss_rcvd$year <- format(oss_rcvd$date, format = "%Y")
oss_rcvd <- subset(oss_rcvd, year == "2017")
oss_rcvd <- oss_rcvd[!oss_rcvd$source_code %in% c("OSB", "OSN"),]