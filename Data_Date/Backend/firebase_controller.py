import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import datetime
import os
import json

# Initialize Firebase using service account key file or environment variable
def initialize_firebase():
    if not firebase_admin._apps:
        # Option 1: Use service account key file (for local development)
        service_account_path = './serviceAccountKey.json'
        
        # Option 2: Use environment variable (for production)
        service_account_env = os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY')
        
        if os.path.exists(service_account_path):
            # Use local file
            cred = credentials.Certificate(service_account_path)
            print("🔥 Using local service account key file")
        elif service_account_env:
            # Use environment variable
            service_account_info = json.loads(service_account_env)
            cred = credentials.Certificate(service_account_info)
            print("🔥 Using service account key from environment variable")
        else:
            raise Exception("No Firebase service account key found. Please add serviceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT_KEY environment variable.")
        
        # Initialize the app
        firebase_admin.initialize_app(cred)

# Initialize Firebase
initialize_firebase()

# Initialize Firestore client
db = firestore.client()

def add_spotify_data_to_firebase(top_songs_array, top_artists_array, top_genres_array, valence, energy, danceability, tempo, instrumentalness, user_id=None):
    """
    Add top artists and genres arrays to Firestore separately
    
    Args:
        top_artists_array (list): List of top artist names
        top_genres_array (list): List of top genre names
        user_id (str): Optional user identifier
    
    Returns:
        dict: Success status and any error messages
    """
    try:
        # Create user ID if not provided
        if user_id is None:
            user_id = f"user_{int(datetime.datetime.now().timestamp())}"
        
        # Reference to the user collection
        user_ref = db.collection('user_collection').document(user_id)
        
        # Create the data structure for Firestore
        user_data = {
            'top_songs': top_songs_array,
            'top_artists': top_artists_array,
            'top_genres': top_genres_array, 
            'valence' : valence, 
            'energy' : energy, 
            'danceability' : danceability, 
            'tempo' : tempo, 
            'instrumentalness' : instrumentalness
        }
        
        # Add data to Firestore
        user_ref.set(user_data)
        
        print(f"✅ Successfully added data to Firestore for user: {user_id}")
        print(f"📊 Artists: {top_artists_array}")
        print(f"🎭 Genres: {top_genres_array}")
        
        return {
            'success': True,
            'user_id': user_id,
            'message': 'Data successfully added to Firestore'
        }
        
    except Exception as e:
        error_msg = f"❌ Error adding data to Firestore: {str(e)}"
        print(error_msg)
        return {
            'success': False,
            'error': str(e),
            'message': error_msg
        }

def get_user_spotify_data(user_id): 
    """
    Retrieve user's Spotify data from Firestore and automatically save to file
    
    Args:
        user_id (str): User identifier
        
    Returns:
        dict: User's Spotify data in formatted structure or None if not found
    """
    try:
        user_ref = db.collection('user_collection').document(user_id)
        doc = user_ref.get()
        
        if doc.exists:
            raw_data = doc.to_dict()
            print(f"📖 Retrieved data for user: {user_id}")
            
            # Format the data in the requested structure
            formatted_data = {
                "valence": raw_data.get('valence', 0.0),
                "energy": raw_data.get('energy', 0.0),
                "danceability": raw_data.get('danceability', 0.0),
                "tempo": raw_data.get('tempo', 0.0),
                "instrumentalness": raw_data.get('instrumentalness', 0.0),
                "top_genres": raw_data.get('top_genres', []),
                "top_artists": raw_data.get('top_artists', []),
                "top_songs": raw_data.get('top_songs', [])
            }
            
            # Automatically save to file when data is retrieved
            save_result = save_user_data_to_file(user_id)
            if save_result['success']:
                print(f"💾 Data automatically saved to: {save_result['filename']}")
            else:
                print(f"⚠️ Warning: Could not save to file: {save_result['message']}")
            
            return formatted_data
        else:
            print(f"❌ No data found for user: {user_id}")
            return None
            
    except Exception as e:
        print(f"❌ Error retrieving data: {str(e)}")
        return None

def get_all_spotify_data():
    """
    Retrieve all users' Spotify data from Firestore
    
    Returns:
        dict: All users' data or None if error
    """
    try:
        users_ref = db.collection('user_collection')
        docs = users_ref.stream()
        
        all_data = {}
        for doc in docs:
            all_data[doc.id] = doc.to_dict()
        
        if all_data:
            print("📊 Retrieved all Spotify data from Firestore")
            return all_data
        else:
            print("❌ No data found in Firestore")
            return None
            
    except Exception as e:
        print(f"❌ Error retrieving all data: {str(e)}")
        return None

def update_user_field(user_id, field_name, field_value):
    """
    Update a specific field for a user
    
    Args:
        user_id (str): User identifier
        field_name (str): Field to update ('top_artists' or 'top_genres')
        field_value (list): New value for the field
        
    Returns:
        dict: Success status
    """
    try:
        user_ref = db.collection('user_collection').document(user_id)
        
        # Update only the specific field
        user_ref.update({
            field_name: field_value,
            'last_updated': datetime.datetime.now()
        })
        
        print(f"✅ Successfully updated {field_name} for user: {user_id}")
        
        return {
            'success': True,
            'message': f'{field_name} updated successfully'
        }
        
    except Exception as e:
        error_msg = f"❌ Error updating {field_name}: {str(e)}"
        print(error_msg)
        return {
            'success': False,
            'error': str(e),
            'message': error_msg
        }
    

def update_user_match(user_id, partner_id, score):
    """
    Write a single match for user_id:
      matches/{user_id} → { partner: partner_id, score: score }
    """
    doc_ref = db.collection('matches_collection').document(user_id)
    doc_ref.set({
        'partner': partner_id,
        'score': score
    })

def save_user_data_to_file(user_id, filename='formatted_user_data.json'):
    """
    Retrieve user's Spotify data from Firestore and save to a formatted JSON file
    Always overwrites the same file
    
    Args:
        user_id (str): User identifier
        filename (str): Filename to save to (defaults to 'formatted_user_data.json')
        
    Returns:
        dict: Success status and file path
    """
    try:
        # Get user data from Firestore
        user_data = get_user_spotify_data(user_id)
        
        if user_data is None:
            return {
                'success': False,
                'error': 'No user data found',
                'message': f'No data found for user: {user_id}'
            }
        
        # Add metadata
        formatted_data = {
            'user_id': user_id,
            'export_date': datetime.datetime.now().isoformat(),
            'data': user_data
        }
        
        # Always overwrite the file
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(formatted_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ User data overwritten in: {filename}")
        print(f"📊 Data includes: {len(user_data.get('top_artists', []))} artists, {len(user_data.get('top_genres', []))} genres, {len(user_data.get('top_songs', []))} songs")
        
        return {
            'success': True,
            'filename': filename,
            'file_path': os.path.abspath(filename),
            'message': f'User data successfully overwritten in {filename}'
        }
        
    except Exception as e:
        error_msg = f"❌ Error saving user data to file: {str(e)}"
        print(error_msg)
        return {
            'success': False,
            'error': str(e),
            'message': error_msg
        }

def save_all_users_to_files(output_dir='user_exports'):
    """
    Save all users' data to separate JSON files in a directory
    Always overwrites existing files
    
    Args:
        output_dir (str): Directory to save files (will be created if doesn't exist)
        
    Returns:
        dict: Success status and list of saved files
    """
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Get all users' data
        all_data = get_all_spotify_data()
        
        if not all_data:
            return {
                'success': False,
                'error': 'No data found',
                'message': 'No user data found in Firestore'
            }
        
        saved_files = []
        
        for user_id, user_data in all_data.items():
            filename = os.path.join(output_dir, f'user_data_{user_id}.json')
            
            # Add metadata
            formatted_data = {
                'user_id': user_id,
                'export_date': datetime.datetime.now().isoformat(),
                'data': user_data
            }
            
            # Always overwrite the file
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(formatted_data, f, indent=2, ensure_ascii=False)
            
            saved_files.append(filename)
            print(f"✅ Data for user {user_id} overwritten in {filename}")
        
        print(f"📁 All user data overwritten in {output_dir}/ directory")
        
        return {
            'success': True,
            'output_dir': output_dir,
            'files_saved': len(saved_files),
            'saved_files': saved_files,
            'message': f'Successfully overwrote {len(saved_files)} user files in {output_dir}/'
        }
        
    except Exception as e:
        error_msg = f"❌ Error saving all users to files: {str(e)}"
        print(error_msg)
        return {
            'success': False,
            'error': str(e),
            'message': error_msg
        }

