# match_engine.py
# Backend matchmaking engine script for "Data Date" app.
# - Connects to Firebase Firestore
# - Fetches user Spotify feature profiles
# - Computes pairwise cosine similarity and pairs everyone one-to-one
# - Stores each user's single partner and similarity score in Firestore

"""
Usage:
1. Place 'serviceAccountKey.json' from your Firebase project in this directory.
2. Install dependencies:
   pip install firebase-admin scikit-learn numpy
3. Run the script:
   python match_engine.py
"""

import firebase_admin
from firebase_admin import credentials, firestore
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import itertools

# === STEP 1: Initialize Firebase ===
cred = credentials.Certificate("/Users/andy/Documents/Data_Date/Data_Date/Backend/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# === STEP 2: Fetch all user profiles ===
def fetch_all_users():
    """
    Retrieve all user documents from Firestore 'users' collection.
    Returns:
        dict mapping user_id -> profile_dict
    """
    users_ref = db.collection('users')
    return {doc.id: doc.to_dict() for doc in users_ref.stream()}

# === STEP 3: Extract features ===
def extract_features(profile):
    """
    Convert a user profile dict into a numeric feature vector.
    Expects keys: valence, energy, danceability, tempo, instrumentalness.
    """
    return np.array([
        profile.get('valence', 0.0),
        profile.get('energy', 0.0),
        profile.get('danceability', 0.0),
        profile.get('tempo', 0.0),
        profile.get('instrumentalness', 0.0)
    ]).reshape(1, -1)

# === STEP 4: Compute pairwise similarity scores ===
def compute_pairwise_scores(users):
    """
    Compute cosine similarity for every unique user pair.
    Returns:
        List of tuples (user1, user2, score), sorted descending by score.
    """
    pairs = []
    ids = list(users.keys())
    for u1, u2 in itertools.combinations(ids, 2):
        v1 = extract_features(users[u1])
        v2 = extract_features(users[u2])
        score = float(cosine_similarity(v1, v2)[0][0])
        pairs.append((u1, u2, round(score, 3)))
    return sorted(pairs, key=lambda x: x[2], reverse=True)

# === STEP 5: Generate one-to-one pairings ===
def generate_pairs(pairwise_scores):
    """
    Greedily assign each user a single partner based on highest similarity.
    Returns:
        List of (user1, user2, score) for each matched pair.
    """
    matched = set()
    final_pairs = []
    for u1, u2, score in pairwise_scores:
        if u1 not in matched and u2 not in matched:
            matched.update([u1, u2])
            final_pairs.append((u1, u2, score))
    return final_pairs

# === STEP 6: Store pairings in Firestore ===
def store_pairs(pairs):
    """
    Save each user's partner and similarity score to 'matches/{user_id}'.
    """
    for u1, u2, score in pairs:
        db.collection('matches').document(u1).set({
            'partner': u2,
            'score': score
        })
        db.collection('matches').document(u2).set({
            'partner': u1,
            'score': score
        })
        print(f"[✔] Paired {u1} ↔ {u2} (score: {score})")

# === MAIN EXECUTION ===
if __name__ == "__main__":
    print("🔄 Starting pairing engine...")
    users = fetch_all_users()
    pairwise_scores = compute_pairwise_scores(users)
    pairs = generate_pairs(pairwise_scores)
    store_pairs(pairs)
    print("✅ Pairing complete. Each user has one partner.")