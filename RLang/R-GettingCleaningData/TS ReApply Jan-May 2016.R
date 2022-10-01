library(readxl)
data <- read_excel(path = "/Users/Danny/Downloads/List Reapply_Jan-May'16_78577.xlsx", 
                   sheet = 1, col_names = TRUE)

library(dplyr)

data <- filter(data, !is.na(ID))  # Remove blank row

names(data) <- make.names(names(data))  # Rename colnames
coName <- colnames(data)  #  Extract col names
fix(coName)  # Edit colnames
names(data) <- coName  # Store back edited colnames
rm(coName)  # Remove varible colnames

data$Date <- as.Date(paste0("2015-", data$Data.Mth, "-01"))  # Create date

# saveRDS(data, file = "/Users/Danny/Documents/TS Reapply.RDS")

# data$Old_Product <- ifelse(substr(data$Old.Product, 3, 3) == "L", "RL", "CC")

data$Old_Product <- sapply(data$Old.Product, FUN = function(x) {
  ifelse(grepl("VRL", x), "RL", "CC")
}) # Convert to short product names

data$Old_Reason <- substr(data$Old.REASON, 2, 2) # Extract Old Reason
data$Old_ReasonDESC <- substr(data$Old.REASON, 4, 6)  # Extract Old Reason Code

library(ggplot2)
ggplot(data = data, aes(x = date)) +
  geom_bar(aes(fill = Old_Product))
