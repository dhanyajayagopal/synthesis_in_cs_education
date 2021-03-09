#!/usr/bin/env python3

import os
import time

################################################################################
# Helpers

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

data = []

for filename in os.listdir(LOG_DIRECTORY):
    if filename.startswith("log"):
        dot_index = filename.index(".")
        participant_id = int(filename[3:filename.index(".")])
        if participant_id not in EXCLUDED_PARTICIPANT_IDS:
            with open(LOG_DIRECTORY + filename) as f:
                data.append((participant_id,) + extract_data(f.readlines()))

print("% Generated on", time.strftime("%Y-%m-%d at %H:%M:%S %Z"))
print(
    "Participant ID, Time to Complete Task 1 (s), Time to Complete Task 2 (s)"
)
for row in sorted(data):
    print(*row, sep=", ", end="\n")
