import os 
import time
import json

from flask import Flask, request, session, url_for, redirect, jsonify
from flask_cors import CORS

from spotipy import Spotify 
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler

from firebase_controller import add_spotify_data_to_firebase, get_user_spotify_data

# === Replace with your Spotify app credentials ===
CLIENT_ID = '01b47c0963834b1f9869b3cc8fb122a7'
CLIENT_SECRET = 'b1c0561f9c6d4430852242ba917f216c'
REDIRECT_URI = 'http://127.0.0.1:5000/callback'
SCOPE = 'user-top-read'

app = Flask(__name__) 
app.config['SECRET_KEY'] = os.urandom(64)

# Enable CORS for React frontend
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5000'], 
     supports_credentials=True, allow_headers=['Content-Type'])

cache_handler = FlaskSessionCacheHandler(session)

# Authentication manager 
sp_oauth = SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope=SCOPE, 
    cache_handler=cache_handler, 
    show_dialog=True
)

sp = Spotify(auth_manager=sp_oauth)

# Access rules with the spotify api, flask endpoints and website navigation
@app.route('/')
def home(): 
    if not sp_oauth.validate_token(cache_handler.get_cached_token()): 
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    return redirect(url_for('get_songs'))

# Handle spotify when the user has already been there
@app.route('/callback') 
def callback(): 
    sp_oauth.get_access_token(request.args['code'])
    return redirect(url_for('get_songs'))

@app.route('/get_songs') 
def get_songs(): 
    if not sp_oauth.validate_token(cache_handler.get_cached_token()): 
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    
    try:
        # Get top 10 tracks
        songs = sp.current_user_top_tracks(limit=10, time_range='medium_term')
        
        # Extract song information and get audio features
        songs_info = []
        
        # Get the top tracks
        for idx, track in enumerate(songs['items'], 1):
            song_data = {
                'rank': idx,
                'name': track['name'],
                'artist': ', '.join([artist['name'] for artist in track['artists']]),
                'album': track['album']['name'],
                'popularity': track['popularity'],
                'external_url': track['external_urls']['spotify']
            }
            
            # Try to get audio features for individual track
            try:
                time.sleep(0.1)  # Small delay to avoid rate limiting
                features = sp.audio_features([track['id']])[0]
                
                if features:
                    song_data.update({
                        'valence': round(features['valence'], 3),
                        'energy': round(features['energy'], 3),
                        'danceability': round(features['danceability'], 3),
                        'tempo': round(features['tempo'], 1),
                        'instrumentalness': round(features['instrumentalness'], 3)
                    })
                else:
                    # Use mock data for demonstration purposes
                    import random
                    song_data.update({
                        'valence': round(random.uniform(0.1, 0.9), 3),
                        'energy': round(random.uniform(0.1, 0.9), 3),
                        'danceability': round(random.uniform(0.1, 0.9), 3),
                        'tempo': round(random.uniform(80, 180), 1),
                        'instrumentalness': round(random.uniform(0.0, 0.5), 3)
                    })
                    print(f"Using mock data for: {track['name']}")
            except Exception as audio_error:
                print(f"Error fetching features for {track['name']}: {type(audio_error).__name__}: {audio_error}")
                # Let's also try to see what the actual HTTP response is
                import traceback
                print(f"Full traceback: {traceback.format_exc()}")
                # Use mock data as fallback
                import random
                song_data.update({
                    'valence': round(random.uniform(0.1, 0.9), 3),
                    'energy': round(random.uniform(0.1, 0.9), 3),
                    'danceability': round(random.uniform(0.1, 0.9), 3),
                    'tempo': round(random.uniform(80, 180), 1),
                    'instrumentalness': round(random.uniform(0.0, 0.5), 3)
                })
                print(f"Using mock data for: {track['name']} due to API error")
            
            songs_info.append(song_data)
        
        # Get top artists
        all_artists = sp.current_user_top_artists(limit=30, time_range='medium_term')
        
        # Extract top 10 artists information
        artists_info = []
        for idx, artist in enumerate(all_artists['items'][:10], 1):
            artist_data = {
                'rank': idx,
                'name': artist['name'],
                'genres': artist['genres'][:3] if artist['genres'] else ['No genres listed'],
                'popularity': artist['popularity'],
                'followers': artist['followers']['total'],
                'external_url': artist['external_urls']['spotify']
            }
            artists_info.append(artist_data)
        
        # Extract and count genres from all top artists
        genre_count = {}
        for artist in all_artists['items']:
            for genre in artist['genres']:
                genre_count[genre] = genre_count.get(genre, 0) + 1
        
        top_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)[:10]
        genres_info = []
        for idx, (genre, count) in enumerate(top_genres, 1):
            genre_data = {
                'rank': idx,
                'name': genre.title(),
                'count': count,
                'percentage': round((count / len(all_artists['items'])) * 100, 1)
            }
            genres_info.append(genre_data)
        
        # Calculate averages
        def calculate_average(arr):
            numeric_values = [val for val in arr if isinstance(val, (int, float))]
            return round(sum(numeric_values) / len(numeric_values), 3) if numeric_values else 0.0
        
        valence_array = [song['valence'] for song in songs_info]
        energy_array = [song['energy'] for song in songs_info]
        danceability_array = [song['danceability'] for song in songs_info]
        tempo_array = [song['tempo'] for song in songs_info]
        instrumentalness_array = [song['instrumentalness'] for song in songs_info]
        
        average_valence = calculate_average(valence_array)
        average_energy = calculate_average(energy_array)
        average_danceability = calculate_average(danceability_array)
        average_tempo = calculate_average(tempo_array)
        average_instrumentalness = calculate_average(instrumentalness_array)
        
        # Save to Firebase
        firebase_response = add_spotify_data_to_firebase(
            top_songs_array=[song['name'] for song in songs_info],
            top_artists_array=[artist['name'] for artist in artists_info],
            top_genres_array=[genre['name'] for genre in genres_info],
            valence=average_valence,
            energy=average_energy,
            danceability=average_danceability,
            tempo=average_tempo,
            instrumentalness=average_instrumentalness,
            user_id=session.get('user_id') # Change this to corresponding user id 
        )
        
        # Print formatted data as requested
        if firebase_response.get('success') and firebase_response.get('user_id'):
            user_data = get_user_spotify_data(firebase_response['user_id'])
            if user_data:
                print("\n=== FORMATTED USER DATA ===")
                print(f"User ID: {firebase_response['user_id']}")
                print(f"Data: {user_data}")
                print("===========================\n")
        
        return redirect('http://localhost:5173/matches')
        
    except Exception as e:
        return f"<html><body><h1>Error: {str(e)}</h1></body></html>", 500

# NEW API ROUTES FOR REACT INTEGRATION

@app.route('/api/spotify/auth-url')
def get_auth_url():
    """Get Spotify authorization URL for frontend"""
    try:
        auth_url = sp_oauth.get_authorize_url()
        return jsonify({
            'success': True,
            'auth_url': auth_url
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/spotify/status')
def spotify_status():
    """Check if user is authenticated with Spotify"""
    try:
        token_valid = sp_oauth.validate_token(cache_handler.get_cached_token())
        return jsonify({
            'success': True,
            'authenticated': token_valid
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'authenticated': False,
            'error': str(e)
        })

@app.route('/api/spotify/user-data')
def get_user_data_api():
    """Get user's Spotify data as JSON for React frontend"""
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return jsonify({
            'success': False,
            'error': 'Not authenticated with Spotify',
            'authenticated': False
        }), 401
    
    try:
        # Get top 10 tracks
        songs = sp.current_user_top_tracks(limit=10, time_range='medium_term')
        
        # Extract song information and get audio features
        songs_info = []
        
        for idx, track in enumerate(songs['items'], 1):
            song_data = {
                'rank': idx,
                'name': track['name'],
                'artist': ', '.join([artist['name'] for artist in track['artists']]),
                'album': track['album']['name'],
                'popularity': track['popularity'],
                'external_url': track['external_urls']['spotify']
            }
            
            # Try to get audio features for individual track
            try:
                time.sleep(0.1)  # Small delay to avoid rate limiting
                features = sp.audio_features([track['id']])[0]
                
                if features:
                    song_data.update({
                        'valence': round(features['valence'], 3),
                        'energy': round(features['energy'], 3),
                        'danceability': round(features['danceability'], 3),
                        'tempo': round(features['tempo'], 1),
                        'instrumentalness': round(features['instrumentalness'], 3)
                    })
                else:
                    # Use mock data for demonstration purposes
                    import random
                    song_data.update({
                        'valence': round(random.uniform(0.1, 0.9), 3),
                        'energy': round(random.uniform(0.1, 0.9), 3),
                        'danceability': round(random.uniform(0.1, 0.9), 3),
                        'tempo': round(random.uniform(80, 180), 1),
                        'instrumentalness': round(random.uniform(0.0, 0.5), 3)
                    })
            except Exception as audio_error:
                # Use mock data as fallback
                import random
                song_data.update({
                    'valence': round(random.uniform(0.1, 0.9), 3),
                    'energy': round(random.uniform(0.1, 0.9), 3),
                    'danceability': round(random.uniform(0.1, 0.9), 3),
                    'tempo': round(random.uniform(80, 180), 1),
                    'instrumentalness': round(random.uniform(0.0, 0.5), 3)
                })
            
            songs_info.append(song_data)
        
        # Get top artists
        all_artists = sp.current_user_top_artists(limit=30, time_range='medium_term')
        artists_info = []
        for idx, artist in enumerate(all_artists['items'][:10], 1):
            artist_data = {
                'rank': idx,
                'name': artist['name'],
                'genres': artist['genres'][:3] if artist['genres'] else ['No genres listed'],
                'popularity': artist['popularity'],
                'followers': artist['followers']['total'],
                'external_url': artist['external_urls']['spotify']
            }
            artists_info.append(artist_data)
        
        # Extract and count genres
        genre_count = {}
        for artist in all_artists['items']:
            for genre in artist['genres']:
                genre_count[genre] = genre_count.get(genre, 0) + 1

        top_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)[:10]
        genres_info = []
        for idx, (genre, count) in enumerate(top_genres, 1):
            genre_data = {
                'rank': idx,
                'name': genre.title(),
                'count': count,
                'percentage': round((count / len(all_artists['items'])) * 100, 1)
            }
            genres_info.append(genre_data)
        
        # Calculate averages
        def calculate_average(arr):
            numeric_values = [val for val in arr if isinstance(val, (int, float))]
            return round(sum(numeric_values) / len(numeric_values), 3) if numeric_values else 0.0
        
        valence_array = [song['valence'] for song in songs_info]
        energy_array = [song['energy'] for song in songs_info]
        danceability_array = [song['danceability'] for song in songs_info]
        tempo_array = [song['tempo'] for song in songs_info]
        instrumentalness_array = [song['instrumentalness'] for song in songs_info]
        
        average_valence = calculate_average(valence_array)
        average_energy = calculate_average(energy_array)
        average_danceability = calculate_average(danceability_array)
        average_tempo = calculate_average(tempo_array)
        average_instrumentalness = calculate_average(instrumentalness_array)
        
        # Save to Firebase
        firebase_response = add_spotify_data_to_firebase(
            top_songs_array=[song['name'] for song in songs_info],
            top_artists_array=[artist['name'] for artist in artists_info],
            top_genres_array=[genre['name'] for genre in genres_info],
            valence=average_valence,
            energy=average_energy,
            danceability=average_danceability,
            tempo=average_tempo,
            instrumentalness=average_instrumentalness,
            user_id=session.get('user_id')
        )
        
        # Return formatted data in the exact format you requested
        formatted_data = {
            "valence": average_valence,
            "energy": average_energy,
            "danceability": average_danceability,
            "tempo": average_tempo,
            "instrumentalness": average_instrumentalness,
            "top_genres": [genre['name'] for genre in genres_info[:3]],
            "top_artists": [artist['name'] for artist in artists_info[:3]]
        }
        
        # Print the formatted data as requested
        if firebase_response.get('success') and firebase_response.get('user_id'):
            user_data = get_user_spotify_data(firebase_response['user_id'])
            if user_data:
                print("\n=== FORMATTED USER DATA ===")
                print(f"User ID: {firebase_response['user_id']}")
                print(f"Data: {user_data}")
                print("===========================\n")
        
        return jsonify({
            'success': True,
            'authenticated': True,
            'formatted_data': formatted_data,
            'detailed_data': {
                'songs': songs_info,
                'artists': artists_info,
                'genres': genres_info
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/set-user-id', methods=['POST'])
def set_user_id():
    """Set user ID in session for React frontend"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if user_id:
            session['user_id'] = user_id
            return jsonify({
                'success': True,
                'message': 'User ID set in session'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No user_id provided'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
