helper.function <- function()
{
  return(1)
}


findRecency <- function(df, current_week = 51) {
    # create vector of unique week submit & convert to 'num'
    unique_week_num <- unique(df$no_week_of_year)
    # decending order by week
    unique_week_num <- sort(unique_week_num, decreasing = TRUE)
    # number of week submit throught out the year
    NUMBER_OF_WEEK <- length(unique_week_num)
    
    if(NUMBER_OF_WEEK != 1) {  # Check if only 1 week submit data
        last_week <- unique_week_num[1]
        week_lag1 <- unique_week_num[2]
        diff_last <- current_week - last_week
        diff_lag1 <- current_week - week_lag1
    } else {
        last_week <- unique_week_num[1]
        week_lag1 <- NA
        diff_last <- current_week - last_week
        diff_lag1 <- NA
    }
    return(data.frame("last_week" = last_week,
                      "diff_last" = diff_last,
                      "week_lag1" = week_lag1,
                      "diff_lag1" = diff_lag1))
}