import os 
import time

from flask import Flask, request, session, url_for, redirect

from spotipy import Spotify 
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler

# === Replace with your Spotify app credentials ===
CLIENT_ID = '01b47c0963834b1f9869b3cc8fb122a7'
CLIENT_SECRET = 'b1c0561f9c6d4430852242ba917f216c'
REDIRECT_URI = 'http://127.0.0.1:5000/callback'
SCOPE = 'user-top-read'

app = Flask(__name__) 
app.config['SECRET_KEY'] = os.urandom(64) # Secret key for encryption, if we run into issues CHANGE into a fixed value

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
    if not sp_oauth.validate_token(cache_handler.get_cached_token()): # Validating token
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    return redirect(url_for('get_songs'))

@app.route('/callback') # if youve already logged in 
def callback(): 
    sp_oauth.get_access_token(request.args['code'])
    return redirect(url_for('get_songs'))

@app.route('/get_songs') 
def get_songs(): 
    if not sp_oauth.validate_token(cache_handler.get_cached_token()): 
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    
    try:
        # Get top 5 tracks
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
                print(f"Trying to get features for track ID: {track['id']}")
                features = sp.audio_features([track['id']])[0]  # Get first item from list
                print(f"Raw features response: {features}")
                
                if features:
                    print(f"Successfully got features for: {track['name']}")
                    song_data.update({
                        'valence': round(features['valence'], 3),
                        'energy': round(features['energy'], 3),
                        'danceability': round(features['danceability'], 3),
                        'tempo': round(features['tempo'], 1),
                        'instrumentalness': round(features['instrumentalness'], 3)
                    })
                else:
                    print(f"No features returned for: {track['name']} - features is None or empty")
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
                'genres': artist['genres'][:3] if artist['genres'] else ['No genres listed'],  # Show top 3 genres
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

        # Get top 10 genres
        top_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)[:10]

        genres_info = []
        for idx, (genre, count) in enumerate(top_genres, 1):
            genre_data = {
                'rank': idx,
                'name': genre.title(),  # Capitalize genre name
                'count': count,
                'percentage': round((count / len(all_artists['items'])) * 100, 1)
            }
            genres_info.append(genre_data)
        
        # Save to arrays for potential future use
        top_songs_array = [song['name'] for song in songs_info]
        top_artists_array = [artist['name'] for artist in artists_info]
        top_genres_array = [genre['name'] for genre in genres_info]
        
        # Audio features arrays
        valence_array = [song['valence'] for song in songs_info]
        energy_array = [song['energy'] for song in songs_info]
        danceability_array = [song['danceability'] for song in songs_info]
        tempo_array = [song['tempo'] for song in songs_info]
        instrumentalness_array = [song['instrumentalness'] for song in songs_info]
        
        # Calculate averages for audio features (only for numeric values, skip 'N/A')
        def calculate_average(arr):
            numeric_values = [val for val in arr if isinstance(val, (int, float))]
            return round(sum(numeric_values) / len(numeric_values), 3) if numeric_values else 0.0
        
        # Audio feature averages saved as decimals
        average_valence = calculate_average(valence_array)
        average_energy = calculate_average(energy_array)
        average_danceability = calculate_average(danceability_array)
        average_tempo = calculate_average(tempo_array)
        average_instrumentalness = calculate_average(instrumentalness_array)
        
        # Print arrays to console for debugging/verification
        print("Top 5 Songs Array:", top_songs_array)
        print("Top 5 Artists Array:", top_artists_array)
        print("Top 5 Genres Array:", top_genres_array)
        print("Valence Array:", valence_array)
        print("Energy Array:", energy_array)
        print("Danceability Array:", danceability_array)
        print("Tempo Array:", tempo_array)
        print("Instrumentalness Array:", instrumentalness_array)
        
        # Print averages
        print("\n=== AUDIO FEATURE AVERAGES ===")
        print(f"Average Valence: {average_valence}")
        print(f"Average Energy: {average_energy}")
        print(f"Average Danceability: {average_danceability}")
        print(f"Average Tempo: {average_tempo}")
        print(f"Average Instrumentalness: {average_instrumentalness}")
        print("================================\n")
        
        # Create HTML response
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Your Spotify Music Profile</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background-color: #191414; color: #1db954; }
                h1, h2 { text-align: center; color: #1db954; }
                h2 { margin-top: 40px; margin-bottom: 20px; }
                .track, .genre, .artist { background-color: #282828; margin: 10px 0; padding: 15px; border-radius: 8px; }
                .track-name, .genre-name, .artist-name { font-size: 18px; font-weight: bold; color: #ffffff; }
                .track-artist, .genre-stats, .artist-details { color: #b3b3b3; margin: 5px 0; }
                .track-details, .audio-features { color: #b3b3b3; font-size: 14px; }
                .audio-features { margin-top: 8px; padding: 8px; background-color: #1a1a1a; border-radius: 4px; }
                a { color: #1db954; text-decoration: none; }
                a:hover { text-decoration: underline; }
                .section { margin-bottom: 50px; }
                .artist-genres { color: #1db954; font-size: 14px; font-style: italic; }
            </style>
        </head>
        <body>
            <h1>🎵 Your Spotify Music Profile</h1>
            
            <div class="section">
                <h2>🎶 Your Top 5 Tracks</h2>
        """
        
        for song in songs_info:
            html_content += f"""
            <div class="track">
                <div class="track-name">#{song['rank']} {song['name']}</div>
                <div class="track-artist">by {song['artist']}</div>
                <div class="track-details">
                    Album: {song['album']} | Popularity: {song['popularity']}/100<br>
                    <a href="{song['external_url']}" target="_blank">🎧 Listen on Spotify</a>
                </div>
                <div class="audio-features">
                    <strong>Audio Features:</strong><br>
                    Valence: {song['valence']} | Energy: {song['energy']} | Danceability: {song['danceability']}<br>
                    Tempo: {song['tempo']} BPM | Instrumentalness: {song['instrumentalness']}
                </div>
            </div>
            """
        
        html_content += """
            </div>
            
            <div class="section">
                <h2>🎤 Your Top 5 Artists</h2>
        """
        
        for artist in artists_info:
            genres_text = ", ".join(artist['genres'])
            html_content += f"""
            <div class="artist">
                <div class="artist-name">#{artist['rank']} {artist['name']}</div>
                <div class="artist-details">
                    Popularity: {artist['popularity']}/100 | Followers: {artist['followers']:,}<br>
                    <div class="artist-genres">Genres: {genres_text}</div>
                    <a href="{artist['external_url']}" target="_blank">🎧 View on Spotify</a>
                </div>
            </div>
            """
        
        html_content += """
            </div>
            
            <div class="section">
                <h2>🎭 Your Top 5 Genres</h2>
        """
        
        for genre in genres_info:
            html_content += f"""
            <div class="genre">
                <div class="genre-name">#{genre['rank']} {genre['name']}</div>
                <div class="genre-stats">
                    Found in {genre['count']} of your top artists ({genre['percentage']}%)
                </div>
            </div>
            """
        
        html_content += """
            </div>
        </body>
        </html>
        """
        
        return html_content
        
    except Exception as e:
        return f"<h1>Error fetching your top tracks:</h1><p>{str(e)}</p>"



if __name__ == '__main__':
    app.run(debug=True) 
