getwd()
setwd("/Users/Danny/Documents/R Project/R Dataset Project/TTA/")

library(xlsx)
file <- "TTA 2016.xls"
dat <- read.xlsx2(file = file, sheetIndex = 1, stringsAsFactors = F)
detach("package:xlsx", unload = T)
rm(file)

# Convert Data format
# di <- grep("[D|d][A|a][T|t][E|e]", names(dat))
# sprintf("Varible with date format to be convert : %s", names(dat)[di])

# for (i in 1:length(di)){
#   dat[[di[i]]] <- as.Date(as.numeric(dat[[di[i]]]), origin = "1899-12-30")  
# }
# rm(list = c("di","i"))

# Using lapply and custom fuction
# Logical vecor of column name with 'date' or 'DATE' 
dl <- grepl("[D|d][A|a][T|t][E|e]", names(dat))

# Print the colunm name with 'date' or 'DATE'
sprintf("Varible to be converted to date format : %s", names(dat)[dl])

# Converted with logical vector and lapply function
dat[dl] <- lapply(dat[dl], function (x) {
  as.Date(as.numeric(x), origin = "1899-12-30")
  })
# Removed unused varible
rm(dl)

# -----------------------
# Read sales agent data with readr
# -----------------------
library(readr)
file <- "DataAllTypeTeam_201601.csv"
guess_encoding(file)
agent <- read_csv(file, locale = locale(date_format = "%m/%d/%y"))
detach("package:readr", unload = T)

# ----------------------
# Read sales agent data with readxl
# ----------------------
library(readxl)

# there are problem importing TL_Name problems from guesssing col_types
# create specific col_types for better data importing

colType <- rep("text", 18) # all 18 column in text format
colType[13] <- "date" # only the 13th column import as date

agent <- read_excel("DataAllTypeTeam_201601.xlsx", sheet = 1, col_types = colType)
detach("package:readxl", unload = T)
names(agent) <- make.names(names(agent))
rm(colType)

# ------------------------------
# Data analysis part with dplyr
# ------------------------------
library(dplyr)

dat %>%
  select(AGENT_ID) %>%
  group_by(AGENT_ID) %>%
  summarise(n = n_distinct(AGENT_ID))  # Count distinct no. of sales agent submit

# --------
# Base
#--------

# Found 89 agent code submitted

dat.agent <- dat %>%
  left_join(agent, c("AGENT_ID" = "Agent_Code")) %>%  # Left join data with different varible names
  mutate(Reason = substr(DECL_REASON, 1, 1)) %>%  # Create shorthanded reason code
  mutate(LineLimit = as.integer(LineLimit)) %>%
  mutate(Income = as.integer(Income))

aggregate(x = dat.agent["Income"], by = dat.agent["TL_Code"], FUN = function(x) {c(n = length(x), avg = mean(x))})

# ---------------------
# Explanatory Analysis
# --------------------

top.TL <- dat.agent %>%
  filter(!is.na(TL_Code)) %>%  # Remove obs with TL_Code = NA
  group_by(TL_Code) %>%
  summarize(n = n()) %>%
  top_n(10) %>%  # Select top 10 TL with no. of obs.
  arrange(desc(n))  # Sort by no. of obs

dat.top.TL <- dat.agent %>%
  left_join(top.TL, by = "TL_Code") %>%  # Select dat with top 10 TL
  filter(!is.na(n)) %>%  # Remove dat not top TL
  transmute(n = NULL)  # Remove no. obs. by TL from top 10 TL

dat.top.TL %>%
  group_by(TL_Code) %>%
  tally() %>%
  arrange(desc(n)) # Recheck no. of obs in top 10 TL

source("/Users/Danny/Google Drive/R Function/myPlot.R")

myBar(dat.agent[dat.agent$Reason == "A", ], "TL_Code")

myBox(dat.agent, "Income", "TL_Code", log = FALSE)
myBox(dat.agent, "Income", "TL_Code", log = TRUE)

myBarBox(dat.agent, "Income", "TL_Code", log = TRUE)
