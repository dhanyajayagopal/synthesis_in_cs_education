#!/usr/bin/env python3

import os
import time
import matplotlib.pyplot as plt
import scipy.stats as stats
import numpy as np

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
                amount_learned[participant_id] = (float(q1) / 5, int(q2), int(q3))

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
# fig.suptitle("Time Taken on Learning Module Portions")
axs[0].set_title("Portion 1 (Search)")
axs[0].boxplot(condition_times_1, labels=time_labels)
axs[0].set(ylabel="Time (min)")
axs[1].set_title("Portion 2 (Insertion)")
axs[1].boxplot(condition_times_2, labels=time_labels)
fig.savefig(RESULTS_DIR + "times.pdf", dpi=600)

# Print time means, ANOVAs, and HSD

t1_avg = [np.average(condition_times_1[0]), np.average(condition_times_1[1]), np.average(condition_times_1[2])]
t2_avg = [np.average(condition_times_2[0]), np.average(condition_times_2[1]), np.average(condition_times_2[2])]

print()
print("Portion 1 Mean Time in Minutes (Control, Half, Full):", t1_avg)
print("Portion 2 Mean Time in Minutes (Control, Half, Full):", t2_avg)
print()
print("Task 1 Times ANOVA:", stats.f_oneway(*condition_times_1))
print("Task 2 Times ANOVA:", stats.f_oneway(*condition_times_2))
print()
print("Task 2 Times", stats.tukey_hsd(*condition_times_2))
print()

# Generate amount learned plots

question_labels = ["Question 1", "Question 2", "Question 3"]

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

q1_avg = [np.average(q1_data[0]), np.average(q1_data[1]), np.average(q1_data[2])]
q2_avg = [np.average(q2_data[0]), np.average(q2_data[1]), np.average(q2_data[2])]
q3_avg = [np.average(q3_data[0]), np.average(q3_data[1]), np.average(q3_data[2])]

al_x = np.arange(len(amount_learned_labels))
al_width = 0.2

fig, ax = plt.subplots()

cond1_rects = ax.bar(al_x - al_width,
                     [q1_avg[0], q2_avg[0], q3_avg[0]],
                     al_width,
                     label=amount_learned_labels[0])
cond2_rects = ax.bar(al_x,
                     [q1_avg[1], q2_avg[1], q3_avg[1]],
                     al_width,
                     label=amount_learned_labels[1])
cond3_rects = ax.bar(al_x + al_width,
                     [q1_avg[2], q2_avg[2], q3_avg[2]],
                     al_width,
                     label=amount_learned_labels[2])

ax.set_ylabel("Average Learning Outcome")
# ax.set_title("Learning Outcomes by Question and Condition")
ax.set_ylim([-1, 1])
ax.set_xticks(al_x)
ax.set_xticklabels(question_labels)
ax.axhline(0, color='k', lw=0.5)
ax.legend()

fig.tight_layout()

fig.savefig(RESULTS_DIR + "learned.pdf", dpi=600)

# Print amount learned means and ANOVAs

q1_anova = stats.f_oneway(*q1_data)
q2_anova = stats.f_oneway(*q2_data)
q3_anova = stats.f_oneway(*q3_data)

print()
print("Q1 Mean Amount Learned (Control, Half, Full):", q1_avg)
print("Q2 Mean Amount Learned (Control, Half, Full):", q2_avg)
print("Q3 Mean Amount Learned (Control, Half, Full):", q3_avg)
print()
print("Q1 Amount Learned ANOVA:", q1_anova)
print("Q2 Amount Learned ANOVA:", q2_anova)
print("Q3 Amount Learned ANOVA:", q3_anova)
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
            + ".pdf",
        dpi=600
    )

print("Done!")
