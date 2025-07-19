# DevsHackathon - Spotify Firebase App

This app connects to Spotify API and stores user's top artists and genres in Firebase Firestore.

## 🔐 Security Setup

### For Local Development:
1. Keep `serviceAccountKey.json` in the project root
2. The app will automatically use this file

### For Production/Deployment:
1. **DO NOT** commit `serviceAccountKey.json` to git
2. Instead, set the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable with the entire JSON content

## 🚀 Environment Variable Setup

### For Heroku/Vercel/Railway:
```bash
# Set this environment variable with your entire service account JSON
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project",...}'
```

### For local .env file:
```bash
# Create a .env file (also ignored by git)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"datadate-8d8df",...}'
```

## 📁 File Structure
```
├── spotify_controller.py      # Main Flask app
├── firebase_controller.py     # Firebase functions
├── serviceAccountKey.json     # ⚠️  Local only (gitignored)
├── .gitignore                # Keeps secrets safe
└── README.md                 # This file
```

## 🛠️ Installation

1. Install dependencies:
```bash
pip install flask spotipy firebase-admin
```

2. Set up Spotify credentials in `spotify_controller.py`

3. Run the app:
```bash
python spotify_controller.py
```

## 🔒 Git Safety
The `.gitignore` file prevents these sensitive files from being committed:
- `serviceAccountKey.json`
- `.env`
- `__pycache__/`

## 🌐 Firebase Structure
```
Firestore Database:
└── user_collection/
    └── user_12345/
        ├── timestamp: "2025-01-19T10:30:00"
        ├── top_artists: ["Artist1", "Artist2", ...]
        └── top_genres: ["Pop", "Rock", ...]
```