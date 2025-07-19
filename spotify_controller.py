import os 

from flask import Flask, request, session, url_for, redirect

from spotipy import Spotify 
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler

# Import Firebase function
from firebase_controller import add_spotify_data_to_firebase

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
        # Get top artists
        all_artists = sp.current_user_top_artists(limit=20, time_range='medium_term')
        
        # Extract top 5 artists information
        artists_info = []
        for idx, artist in enumerate(all_artists['items'][:5], 1):
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
        
        # Get top 5 genres
        top_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)[:5]
        
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
        top_artists_array = [artist['name'] for artist in artists_info]
        top_genres_array = [genre['name'] for genre in genres_info]
        
        # Print arrays to console for debugging/verification
        print("Top 5 Artists Array:", top_artists_array)
        print("Top 5 Genres Array:", top_genres_array)
        
        # Add data to Firebase
        firebase_result = add_spotify_data_to_firebase(top_artists_array, top_genres_array)
        
        # Check if Firebase operation was successful
        if firebase_result['success']:
            print(f"🔥 Firebase Success: {firebase_result['message']}")
        else:
            print(f"🔥 Firebase Error: {firebase_result['message']}")
        
        # Create HTML response
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Your Spotify Music Profile</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; background-color: #191414; color: #1db954; }}
                h1, h2 {{ text-align: center; color: #1db954; }}
                h2 {{ margin-top: 40px; margin-bottom: 20px; }}
                .genre, .artist {{ background-color: #282828; margin: 10px 0; padding: 15px; border-radius: 8px; }}
                .genre-name, .artist-name {{ font-size: 18px; font-weight: bold; color: #ffffff; }}
                .genre-stats, .artist-details {{ color: #b3b3b3; margin: 5px 0; }}
                a {{ color: #1db954; text-decoration: none; }}
                a:hover {{ text-decoration: underline; }}
                .section {{ margin-bottom: 50px; }}
                .artist-genres {{ color: #1db954; font-size: 14px; font-style: italic; }}
                .firebase-status {{ background-color: #{"#1e3a1e" if firebase_result['success'] else "#3a1e1e"}; padding: 10px; margin: 20px 0; border-radius: 5px; text-align: center; }}
                .firebase-status.success {{ color: #4caf50; }}
                .firebase-status.error {{ color: #f44336; }}
            </style>
        </head>
        <body>
            <h1>🎵 Your Spotify Music Profile</h1>
            
            <div class="firebase-status {'success' if firebase_result['success'] else 'error'}">
                🔥 Firebase: {firebase_result['message']}
                {f"<br>User ID: {firebase_result.get('user_id', 'N/A')}" if firebase_result['success'] else ""}
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
