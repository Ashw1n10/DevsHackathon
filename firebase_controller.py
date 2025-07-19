import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import datetime

# Fetch the service account key JSON file contents
# Replace 'path/to/serviceAccountKey.json' with your actual service account key path
cred = credentials.Certificate("D:\Personal Projects\Hackathons\DEVS_2025\DevsHackathon\serviceAccountKey.json")

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

def add_spotify_data_to_firebase(top_artists_array, top_genres_array, user_id=None):
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
        # Generate timestamp for this entry
        timestamp = datetime.datetime.now()
        
        # Create user ID if not provided
        if user_id is None:
            user_id = f"user_{int(datetime.datetime.now().timestamp())}"
        
        # Reference to the user collection
        user_ref = db.collection('user_collection').document(user_id)
        
        # Create the data structure for Firestore
        user_data = {
            'timestamp': timestamp,
            'top_artists': top_artists_array,
            'top_genres': top_genres_array
        }
        
        # Add data to Firestore
        user_ref.set(user_data)
        
        print(f"✅ Successfully added data to Firestore for user: {user_id}")
        print(f"📊 Artists: {top_artists_array}")
        print(f"🎭 Genres: {top_genres_array}")
        
        return {
            'success': True,
            'user_id': user_id,
            'timestamp': timestamp.isoformat(),
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
    Retrieve user's Spotify data from Firestore
    
    Args:
        user_id (str): User identifier
        
    Returns:
        dict: User's Spotify data or None if not found
    """
    try:
        user_ref = db.collection('user_collection').document(user_id)
        doc = user_ref.get()
        
        if doc.exists:
            user_data = doc.to_dict()
            print(f"📖 Retrieved data for user: {user_id}")
            return user_data
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


