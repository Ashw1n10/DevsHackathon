import itertools
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from firebase_controller import (
    initialize_firebase,
    get_all_spotify_data,
    update_user_match
)

# Weights for each component (tweak to taste)
W_AUDIO  = 0.5
W_ARTIST = 0.25
W_SONG   = 0.25

def jaccard_sim(list1, list2):
    s1, s2 = set(list1), set(list2)
    if not s1 and not s2:
        return 0.0
    return len(s1 & s2) / len(s1 | s2)

def extract_audio_vector(profile):
    # Rescale tempo into ~0–1 by dividing by a max (e.g. 250 BPM)
    return np.array([
        profile.get('valence', 0.0),
        profile.get('energy', 0.0),
        profile.get('danceability', 0.0),
        profile.get('tempo', 0.0)  / 250.0,
        profile.get('instrumentalness', 0.0)
    ]).reshape(1, -1)

def compute_pairwise_scores(users):
    """
    users: dict of { user_id: { valence, energy, ..., top_artists, top_songs } }
    Returns sorted list of (u1, u2, combined_score).
    """
    pairs = []
    ids = list(users.keys())

    # Precompute audio vectors
    audio_vecs = {
        uid: extract_audio_vector(users[uid])
        for uid in ids
    }

    for u1, u2 in itertools.combinations(ids, 2):
        # 1) Audio cosine similarity
        a_sim = float(cosine_similarity(audio_vecs[u1], audio_vecs[u2])[0][0])

        # 2) Jaccard on top_artists
        art_sim = jaccard_sim(
            users[u1].get('top_artists', []),
            users[u2].get('top_artists', [])
        )

        # 3) Jaccard on top_songs
        song_sim = jaccard_sim(
            users[u1].get('top_songs', []),
            users[u2].get('top_songs', [])
        )

        # Weighted sum
        combined = W_AUDIO*a_sim + W_ARTIST*art_sim + W_SONG*song_sim
        pairs.append((u1, u2, round(combined, 3)))

    # Sort highest first
    return sorted(pairs, key=lambda x: x[2], reverse=True)

def generate_pairs(pairwise_scores):
    matched = set()
    final = []
    for u1, u2, score in pairwise_scores:
        if u1 not in matched and u2 not in matched:
            matched.update([u1, u2])
            final.append((u1, u2, score))
    return final

def store_pairs(pairs):
    for u1, u2, score in pairs:
        update_user_match(u1, u2, score)
        update_user_match(u2, u1, score)
        print(f"[✔] Paired {u1} ↔ {u2} (score {score})")

if __name__ == "__main__":
    initialize_firebase()
    users = get_all_spotify_data()        # Should now return 'top_songs' as well
    pairwise = compute_pairwise_scores(users)
    pairs    = generate_pairs(pairwise)
    store_pairs(pairs)
    print("✅ Done pairing.")