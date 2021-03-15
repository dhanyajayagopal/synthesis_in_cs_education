#!/usr/bin/env python3

import os
import time
import matplotlib.pyplot as plt
import scipy.stats as stats
import numpy

################################################################################
# Data wrangling helpers

# Conditions

def get_conditions(conditions_filename, excluded):
    conditions = {}
    with open(conditions_filename) as f:
        next(f)
        for line in f:
            [ participant_id_str, condition ] = line.rstrip().split(",")
            participant_id = int(participant_id_str)
            if participant_id not in excluded:
                conditions[int(participant_id)] = condition
    return conditions

# Amount Learned

def get_amount_learned(amount_learned_filename, conditions, excluded):
    amount_learned = {}

    with open(amount_learned_filename) as f:
        next(f)
        for line in f:
            [ participant_id_str, cond, q1, q2, q3 ] = line.split(",", 4)
            participant_id = int(participant_id_str)
            if participant_id not in excluded:
                assert conditions[participant_id] == cond
                amount_learned[participant_id] = (int(q1), int(q2), int(q3))

    return amount_learned

# Times

def parse_time(time_string):
    [integer_part, fractional_part] = time_string.split(".")
    base_epoch = time.mktime(time.strptime(integer_part, "%Y-%m-%d %H:%M:%S"))
    return base_epoch + float("0." + fractional_part)

def extract_times(lines):
    time_first_visited = {}
    for line in lines:
        [time, action, page, _] = line.split(",", 3)
        if action == "page-change":
            if page not in time_first_visited:
                time_first_visited[page] = parse_time(time)

    time_task_1 = None
    time_task_2 = None

    if "1" in time_first_visited and "2" in time_first_visited:
        time_task_1 = time_first_visited["2"] - time_first_visited["1"]

    if "2" in time_first_visited and "3" in time_first_visited:
        time_task_2 = time_first_visited["3"] - time_first_visited["2"]

    return (time_task_1, time_task_2)

def get_times(log_directory, excluded):
    times = {}

    for filename in os.listdir(log_directory):
        if filename.startswith("log"):
            dot_index = filename.index(".")
            participant_id = int(filename[3:filename.index(".")])
            if participant_id not in excluded:
                with open(log_directory + filename) as f:
                    times[participant_id] = extract_times(f)

    return times

################################################################################
# Main

EXCLUDED = [28]
RESULTS_DIR = "results/"

conditions = get_conditions("raw/conditions.csv", EXCLUDED)
amount_learned = get_amount_learned("raw/amount-learned.csv", conditions, EXCLUDED)
times = get_times("../logs/", EXCLUDED)

participant_ids = sorted(conditions.keys())

assert sorted(amount_learned.keys()) == participant_ids
assert sorted(times.keys()) == participant_ids

# Generate main CSV

with open(RESULTS_DIR + "all.csv", "w") as f:
    f.write("% Generated on " + time.strftime("%Y-%m-%d at %H:%M:%S %Z") + "\n")
    f.write("% Excluded participant IDs: " + ", ".join(map(str, EXCLUDED)) + "\n")
    f.write("Participant ID,Condition,Time to Complete Task 1 (s),Time to Complete Task 2 (s),Question 1,Question 2,Question 3\n")

    for pid in participant_ids:
        row = (pid, conditions[pid]) + times[pid] + amount_learned[pid]
        f.write(",".join(map(str, row)) + "\n")

# Generate time plots

time_labels = ["Control", "Half", "Full"]
condition_times_1 = [[], [], []]
condition_times_2 = [[], [], []]

for pid in participant_ids:
    index = time_labels.index(conditions[pid])
    (t1, t2) = times[pid]
    if t1 is not None:
        condition_times_1[index].append(t1 / 60)
    if t2 is not None:
        condition_times_2[index].append(t2 / 60)

fig, axs = plt.subplots(1, 2, sharey=True)
axs[0].set_title("Time on Task 1 (Search)")
axs[0].boxplot(condition_times_1, labels=time_labels)
axs[0].set(ylabel="Time (min)")
axs[1].set_title("Time on Task 2 (Insert)")
axs[1].boxplot(condition_times_2, labels=time_labels)
fig.savefig(RESULTS_DIR + "times.png", dpi=600)

# Print time ANOVAs

print("Task time ANOVAs")
print()
print("Task 1 Times ANOVA: p =", stats.f_oneway(*condition_times_1).pvalue)
print("Task 2 Times ANOVA: p =", stats.f_oneway(*condition_times_2).pvalue)
print()

# Amount learned ANOVAs

amount_learned_labels = ["Control", "Half", "Full"]
q1_data = [[], [], []]
q2_data = [[], [], []]
q3_data = [[], [], []]

for pid in participant_ids:
    index = amount_learned_labels.index(conditions[pid])
    (q1, q2, q3) = amount_learned[pid]
    q1_data[index].append(q1)
    q2_data[index].append(q2)
    q3_data[index].append(q3)

q1_anova = stats.f_oneway(*q1_data)
q2_anova = stats.f_oneway(*q2_data)
q3_anova = stats.f_oneway(*q3_data)

# print("---------------------")
# print("     Q1 Control Mean:", numpy.mean(q1_data[0]))
# print("        Q1 Half Mean:", numpy.mean(q1_data[1]))
# print("        Q1 Full Mean:", numpy.mean(q1_data[2]))
# print("---------------------")
print("Amount learned ANOVAs")
print()
print("Q1 ANOVA: p =", q1_anova.pvalue)
print("Q2 ANOVA: p =", q2_anova.pvalue)
print("Q3 ANOVA: p =", q3_anova.pvalue)
print()
# print(" Q1 Full vs. Control:", stats.ttest_ind(q1_data[0], q1_data[2]))

# Amount learned != 0

print("Amount Learned vs. 0 t-tests")
print()
print("Q1 Control == 0: p =", stats.ttest_1samp(q1_data[0], 0).pvalue)
print("Q1 Half    == 0: p =", stats.ttest_1samp(q1_data[1], 0).pvalue)
print("Q1 Full    == 0: p =", stats.ttest_1samp(q1_data[2], 0).pvalue)
print()
print("Q2 Control == 0: p =", stats.ttest_1samp(q2_data[0], 0).pvalue)
print("Q2 Half    == 0: p =", stats.ttest_1samp(q2_data[1], 0).pvalue)
print("Q2 Full    == 0: p =", stats.ttest_1samp(q2_data[2], 0).pvalue)
print()
print("Q3 Control == 0: p =", stats.ttest_1samp(q3_data[0], 0).pvalue)
print("Q3 Half    == 0: p =", stats.ttest_1samp(q3_data[1], 0).pvalue)
print("Q3 Full    == 0: p =", stats.ttest_1samp(q3_data[2], 0).pvalue)
print()

# Amount learned vs. time taken

for question in range(3):
    fig, ax = plt.subplots(1, 1)
    xs = {"Control": [], "Half": [], "Full": []}
    ys = {"Control": [], "Half": [], "Full": []}

    for pid in participant_ids:
        if times[pid][0] == None or times[pid][1] == None:
            continue

        xs[conditions[pid]].append((times[pid][0] + times[pid][1]) / 60)
        ys[conditions[pid]].append(amount_learned[pid][question])

    ax.set_title("Question " + str(question + 1))
    for (label, color, marker) in [
        ("Control", "r", "o"),
        ("Half", "g", "^"),
        ("Full", "b", "s")
    ]:
        ax.scatter(
            xs[label],
            ys[label],
            label=label,
            color=color,
            marker=marker
        )

        ax.legend(loc="upper right")
        ax.grid(True)

        ax.set(xlabel="Time Taken (min)")
        ax.set(ylabel="Amount Learned")

        if question == 0:
            ax.set_ylim((-5, 5))
        else:
            ax.set_ylim((-2, 2))

    fig.savefig(
        RESULTS_DIR
            + "amount-learned-vs-time-q"
            + str(question + 1)
            + ".png",
        dpi=600
    )

print("Done!")
