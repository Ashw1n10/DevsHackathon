import os 

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
    
    # Get top 5 tracks
    try:
        songs = sp.current_user_top_tracks(limit=5, time_range='medium_term')
        
        # Extract song information
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
            songs_info.append(song_data)
        
        # Get top artists to extract genres
        artists = sp.current_user_top_artists(limit=20, time_range='medium_term')
        
        # Extract and count genres
        genre_count = {}
        for artist in artists['items']:
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
                'percentage': round((count / len(artists['items'])) * 100, 1)
            }
            genres_info.append(genre_data)
        
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
                .track, .genre { background-color: #282828; margin: 10px 0; padding: 15px; border-radius: 8px; }
                .track-name, .genre-name { font-size: 18px; font-weight: bold; color: #ffffff; }
                .track-artist, .genre-stats { color: #b3b3b3; margin: 5px 0; }
                .track-details { color: #b3b3b3; font-size: 14px; }
                a { color: #1db954; text-decoration: none; }
                a:hover { text-decoration: underline; }
                .section { margin-bottom: 50px; }
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
