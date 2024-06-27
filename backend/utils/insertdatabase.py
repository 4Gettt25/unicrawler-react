import os

def store_data_in_database(full_path):
    # Placeholder function. Implement database insertion logic here.
    print(f"Storing {full_path} in the database.")

def store_all_files_in_database(directory_path):  # Fixed parameter name from 'directory_pathy' to 'directory_path'
    # Ensure the directory exists
    if not os.path.exists(directory_path):
        print(f"Directory {directory_path} does not exist.")
        return
    
    # List all files in the directory
    files = os.listdir(directory_path)
    
    for file in files:
        # Construct the full path to the file
        full_path = os.path.join(directory_path, file)
        
        # Check if it's a file and not a directory
        if os.path.isfile(full_path):
            # Call the existing function to store data in the database
            store_data_in_database(full_path)
        else:
            print(f"Skipping directory: {full_path}")

# Example usage
downloads_directory = os.path.expanduser('../downloads')  # Adjust the path to your downloads directory
store_all_files_in_database(downloads_directory)