#!/usr/bin/env python3
"""
Script to export user data from Firebase to a formatted JSON file
"""

from firebase_controller import save_user_data_to_file, save_all_users_to_files

def main():
    print("🚀 Starting user data export...")
    
    # Example: Export a specific user's data
    user_id = "user_1752893653"  # Replace with actual user ID
    print(f"📤 Exporting data for user: {user_id}")
    
    result = save_user_data_to_file(user_id)
    
    if result['success']:
        print(f"✅ Success! File created at: {result['file_path']}")
    else:
        print(f"❌ Error: {result['message']}")
    
    # Optionally, export all users' data
    print("\n📤 Exporting all users' data...")
    all_result = save_all_users_to_files()
    
    if all_result['success']:
        print(f"✅ Success! {all_result['files_saved']} files created in: {all_result['output_dir']}")
    else:
        print(f"❌ Error: {all_result['message']}")

if __name__ == "__main__":
    main() 