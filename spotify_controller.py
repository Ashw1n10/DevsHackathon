import requests
import base64

# === Replace with your Spotify app credentials ===
CLIENT_ID = '01b47c0963834b1f9869b3cc8fb122a7'
CLIENT_SECRET = 'b1c0561f9c6d4430852242ba917f216c'
REDIRECT_URI = 'https://oauth.pstmn.io/v1/callback'

# === Step 1: Guide user to authorize ===
print("🔗 1. Open this URL in your browser to authorize:")
auth_url = (
    f"https://accounts.spotify.com/authorize"
    f"?client_id={CLIENT_ID}"
    f"&response_type=code"
    f"&redirect_uri={REDIRECT_URI}"
    f"&scope=user-top-read"
)
print(auth_url)

# === Step 2: Get authorization code ===
AUTH_CODE = input("\n🎫 2. After authorizing, paste the code from the URL here: ").strip()

# === Step 3: Exchange code for access token ===
auth_str = f"{CLIENT_ID}:{CLIENT_SECRET}"
b64_auth_str = base64.b64encode(auth_str.encode()).decode()

token_response = requests.post(
    'https://accounts.spotify.com/api/token',
    data={
        'grant_type': 'authorization_code',
        'code': AUTH_CODE,
        'redirect_uri': REDIRECT_URI
    },
    headers={
        'Authorization': f'Basic {b64_auth_str}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
)

token_data = token_response.json()
access_token = token_data.get('access_token')

# === Step 4: Use access token to get top artists ===
if access_token:
    print("\n🎧 Top 10 Spotify Artists:")
    response = requests.get(
        'https://api.spotify.com/v1/me/top/artists?limit=10',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    data = response.json()
    print(data)  # <-- Add this to debug response
    for idx, artist in enumerate(data.get('items', []), 1):
        print(f"{idx}. {artist['name']}")

    from collections import Counter

    # Assume `data` is the JSON response from the top artists API

    genres = []
    for artist in data.get('items', []):
        genres.extend(artist.get('genres', []))

    # Count frequency of each genre
    genre_counts = Counter(genres)

    # Get top 10 genres
    top_genres = genre_counts.most_common(10)

    print("\n🎵 Top 10 Genres:")
    for idx, (genre, count) in enumerate(top_genres, 1):
        print(f"{idx}. {genre} (appears in {count} artists)")
else:
    print("❌ Failed to get access token.")
    print(token_data)