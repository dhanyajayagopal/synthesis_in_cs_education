import scipy.stats as stats
import numpy

labels = ["Control", "Half", "Full"]
q1_data = [[], [], []]
q2_data = [[], [], []]
q3_data = [[], [], []]

with open("amount-learned.csv") as f:
    next(f)
    for line in f:
        [_, cond, q1, q2, q3] = line.split(",", 4)
        index = labels.index(cond)
        q1_data[index].append(int(q1))
        q2_data[index].append(int(q2))
        q3_data[index].append(int(q3))

q1_anova = stats.f_oneway(*q1_data)
q2_anova = stats.f_oneway(*q2_data)
q3_anova = stats.f_oneway(*q3_data)

print("---------------------")
print("     Q1 Control Mean:", numpy.mean(q1_data[0]))
print("        Q1 Half Mean:", numpy.mean(q1_data[1]))
print("        Q1 Full Mean:", numpy.mean(q1_data[2]))
print("---------------------")
print("            Q1 ANOVA:", q1_anova)
print("            Q2 ANOVA:", q2_anova)
print("            Q3 ANOVA:", q3_anova)
print("---------------------")
print(" Q1 Full vs. Control:", stats.ttest_ind(q1_data[0], q1_data[2]))
print("---------------------")
print("       Q1 Full vs. 0:", stats.ttest_1samp(q1_data[2], 0))
print("---------------------")
