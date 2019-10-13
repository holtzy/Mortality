####
# Data Preparation
#
# This R script reads data sent by Oleguer and create all the inputs for the d3.js charts
#
# Run it with --> Rscript data_preparation.R
###

## setwd("~/Desktop/Mortality/DATA")

# Libraries
library(dplyr)
library(tidyr)
library(jsonlite)

# Lost Years of Life = LYL File
LYL <- read.table("LYL.txt", header=T)
#improve colnames
colnames(LYL) <- c("mentalDis", "COD", "sex", "n", "LYL")
# Circulatory Diseases, not heart disease or something like that
LYL$COD <- gsub("Dis. Circulatory System", "Circulatory Diseases", LYL$COD)
# Save this long format
tosave <- paste("data_LYL_long = ", toJSON(LYL))
fileConn<-file("LYLlong.js")
writeLines(tosave, fileConn)
close(fileConn)
# get a wide format
wide <- LYL %>%
  filter(n>3) %>%
  select(mentalDis, sex, COD, LYL) %>%
  spread(COD, LYL, -4, fill=NA)
tosave <- paste("data_LYL = ", toJSON(wide))
fileConn<-file("LYL.js")
writeLines(tosave, fileConn)
close(fileConn)


# Mortality Rate ratio = MRR. It compares the number of death with or without mental disorder. If > 1 -> people with a mental disorder dye more often.
MRR <- read.table("MRR.txt", header=T)
clean <- MRR %>%
  filter(!is.na(MRR)) %>%
  select(sex, dx2, cod_label, MRR, MRR_left, MRR_right)
colnames(clean) <- c("sex", "mentalDis", "COD", "MRR", "MRR_left", "MRR_right")
# Special case for circulatory diseases
clean$COD <- gsub("Dis. Circulatory System", "Circulatory Diseases", clean$COD)
# Same for substance use
# clean$mentalDis <- gsub("Substance Use", "Substance Use Disorders", clean$mentalDis)
#save
tosave <- paste("data_MRR = ", toJSON(clean))
fileConn<-file("MRR.js")
writeLines(tosave, fileConn)
close(fileConn)


# MRR age -> Same thing but split by age Range.
# This part is tricky since Oleguer Organized the data on a weird manner. We have to proceed step by step:
MRRage <- read.table("MRR_age.txt", header=T)

# part 1 -> overall plot -> MR = “Persons”, MRR = “Persons (M)”.
a <- MRRage %>% 
  filter(dx2 == "Any Disorder" & cod_label == "All Causes" & sex2 == "Persons") %>% 
  select(dx2, cod_label, sex2, specific, diagnosed, diag_left, diag_right, undiagnosed, undiag_left, undiag_right) %>%
  arrange(specific)
b <- MRRage %>% 
  filter(dx2 == "Any Disorder" & cod_label == "All Causes" & sex2 == "Persons (M)") %>%
  arrange(specific) %>% 
  select(irr, left, right)
A <- cbind(a,b) %>% mutate(type = "Global")  
  
# part 2 -> Split by Sex -> “Males” and “Females” for both MR and MRR
B <- MRRage %>% 
  filter(dx2 == "Any Disorder" & cod_label == "All Causes" & ( sex2 == "Males" | sex2 == "Females")) %>% 
  select(dx2, cod_label, sex2, specific, diagnosed, diag_left, diag_right, undiagnosed, undiag_left, undiag_right, irr, left, right) %>%
  arrange(specific) %>% 
  mutate(type = "SEXspecific")

# part 3 -> Split by COD -> MR = “Persons”, MRR = “Persons (M)”.
a <- MRRage %>% 
  filter(dx2 == "Any Disorder" & (cod_label == "Natural Causes" | cod_label == "Unnatural Causes") & sex2 == "Persons") %>% 
  select(dx2, cod_label, sex2, specific, diagnosed, diag_left, diag_right, undiagnosed, undiag_left, undiag_right) %>%
  arrange(specific)
b <- MRRage %>% 
  filter(dx2 == "Any Disorder" & (cod_label == "Natural Causes" | cod_label == "Unnatural Causes") & sex2 == "Persons (M)") %>%
  arrange(specific) %>%
  select(irr, left, right)
C <- cbind(a,b) %>% mutate(type = "CODspecific")  

# Put them together
clean <- rbind(A,B,C)
tosave <- paste("data_MRRage = ", toJSON(clean))
fileConn<-file("MRRage.js")
writeLines(tosave, fileConn)
close(fileConn)




