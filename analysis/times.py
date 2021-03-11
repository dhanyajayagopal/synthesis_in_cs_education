#!/usr/bin/env python3

import os
import time
import matplotlib.pyplot as plt

################################################################################
# Helpers

def get_conditions():
    conditions = {}
    with open("conditions.csv") as f:
        next(f)
        for line in f:
            [ participant_id, condition ] = line.rstrip().split(",")
            conditions[int(participant_id)] = condition
    return conditions

def parse_time(time_string):
    [integer_part, fractional_part] = time_string.split(".")
    base_epoch = time.mktime(time.strptime(integer_part, "%Y-%m-%d %H:%M:%S"))
    return base_epoch + float("0." + fractional_part)

def extract_data(lines):
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

################################################################################
# Main

LOG_DIRECTORY = "../logs/"
EXCLUDED_PARTICIPANT_IDS = [28]
CONDITIONS = get_conditions()

# Gather data

data = []

for filename in os.listdir(LOG_DIRECTORY):
    if filename.startswith("log"):
        dot_index = filename.index(".")
        participant_id = int(filename[3:filename.index(".")])
        if participant_id not in EXCLUDED_PARTICIPANT_IDS:
            with open(LOG_DIRECTORY + filename) as f:
                data.append(
                    (participant_id, CONDITIONS[participant_id])
                    + extract_data(f)
                )

# Generate CSV

with open("results/times.csv", "w") as f:
    f.write("% Generated on " + time.strftime("%Y-%m-%d at %H:%M:%S %Z") + "\n")
    f.write("Participant ID,Time to Complete Task 1 (s),Time to Complete Task 2 (s)\n")

    for row in sorted(data):
        f.write(",".join(map(str, row)) + "\n")

# Generate plot

labels = ["Control", "Half", "Full"]
condition_times_1 = [[], [], []]
condition_times_2 = [[], [], []]

for (_, condition, t1, t2) in data:
    index = labels.index(condition)
    if t1 is not None:
        condition_times_1[index].append(t1 / 60)
    if t2 is not None:
        condition_times_2[index].append(t2 / 60)

fig, axs = plt.subplots(1, 2, sharey=True)
axs[0].set_title("Time on Task 1 (Search)")
axs[0].boxplot(condition_times_1, labels=labels)
axs[0].set(ylabel="Time (min)")
axs[1].set_title("Time on Task 2 (Insert)")
axs[1].boxplot(condition_times_2, labels=labels)
fig.savefig("results/times.png", dpi=600)
