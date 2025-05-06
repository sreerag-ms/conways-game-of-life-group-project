import os
import csv
from datetime import datetime
import glob
from io import StringIO

def parse_timestamp(timestamp_str):
    return datetime.strptime(timestamp_str, "%Y-%m-%dT%H:%M:%S.%fZ")

# Get all CSV files in the results directory
csv_files = glob.glob("./results/*.csv")

# Print table header
print("{:<20} {:<20} {:<15} {:<15}".format(
    "Patternname", "totalGenerations", "PeakPopulation", "Timetaken(ms)"))
print("-" * 70)

for file_path in csv_files:
    try:
        # Extract pattern name from file path
        pattern_name = os.path.splitext(os.path.basename(file_path))[0]
        
        # Read CSV file
        with open(file_path, 'r') as csv_file:
            lines = csv_file.readlines()
            
            # Skip the filepath comment line if present
            data_lines = lines
            if lines and lines[0].strip().startswith("//"):
                data_lines = lines[1:]
            
            # Parse CSV data using StringIO
            csv_data = StringIO(''.join(data_lines))
            reader = csv.reader(csv_data)
            
            headers = next(reader)
            data_rows = list(reader)
            
            if not data_rows:  # Skip if no data
                continue
                
            # Find column indices
            timestamp_idx = headers.index("Timestamp")
            generation_idx = headers.index("Generation")
            population_idx = headers.index("Population Size")
            
            # Calculate metrics
            first_timestamp = data_rows[0][timestamp_idx]
            last_timestamp = data_rows[-1][timestamp_idx]
            total_generations = int(data_rows[-1][generation_idx])
            peak_population = max(int(row[population_idx]) for row in data_rows)
            
            # Calculate time taken
            start_time = parse_timestamp(first_timestamp)
            end_time = parse_timestamp(last_timestamp)
            time_taken_ms = int((end_time - start_time).total_seconds() * 1000)
            
            # Print the row
            print("{:<20} {:<20} {:<15} {:<15}".format(
                pattern_name, 
                total_generations, 
                peak_population, 
                time_taken_ms
            ))
    
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
