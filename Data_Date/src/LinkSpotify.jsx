import React, { useState, useEffect } from 'react';
import StyleLinkSpotify from './styles/linkSpotify.module.css';

// You'll need to create this service file
const BACKEND_URL = 'http://127.0.0.1:5000';

// Spotify service functions
const checkSpotifyStatus = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/spotify/status`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking Spotify status:', error);
        return { success: false, authenticated: false, error: error.message };
    }
};

const getUserSpotifyData = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/spotify/user-data`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { success: false, error: error.message };
    }
};

function LinkSpotify({ onClose, onLinked }) {
    // Add state management
    const [loading, setLoading] = useState(false);
    const [spotifyData, setSpotifyData] = useState(null);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status when component mounts
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const status = await checkSpotifyStatus();
        if (status.success) {
            setIsAuthenticated(status.authenticated);
            if (status.authenticated) {
                await fetchSpotifyData();
            }
        }
    };

    // Close modal when clicking outside modalContent
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle Spotify linking
    const handleLinkSpotify = () => {
        setLoading(true);
        setError(null);
        window.open('http://127.0.0.1:5000/', '_blank');
        
        // Check authentication status after a delay
        setTimeout(() => {
            checkAuthStatus();
            setLoading(false);
        }, 2000);
    };

    const fetchSpotifyData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getUserSpotifyData();
            
            if (response.success) {
                setSpotifyData(response);
                setIsAuthenticated(true);
                if (onLinked) onLinked(response.formatted_data);
            } else {
                setError(response.error || 'Failed to fetch Spotify data');
                if (!response.authenticated) {
                    setIsAuthenticated(false);
                }
            }
        } catch (err) {
            setError('Error fetching Spotify data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={StyleLinkSpotify.modal} onClick={handleOutsideClick}>
            <div className={StyleLinkSpotify.modalContent}>
                <h2>🎵 Link Spotify Account</h2>
                
                {/* Authentication Status */}
                {!isAuthenticated ? (
                    <div>
                        <p>Connect your Spotify account to get your music profile</p>
                        <button 
                            className={StyleLinkSpotify.LinkSpotifyButton} 
                            onClick={handleLinkSpotify}
                            disabled={loading}
                        >
                            {loading ? 'Connecting...' : '🎧 Link Spotify'}
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>✅ Spotify Connected!</p>
                        <button 
                            className={StyleLinkSpotify.LinkSpotifyButton}
                            onClick={fetchSpotifyData}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : '🔄 Refresh Data'}
                        </button>
                    </div>
                )}
                
                {/* Error Display */}
                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '10px',
                        borderRadius: '4px',
                        margin: '15px 0',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}
                
                {/* Spotify Data Display */}
                {spotifyData && (
                    <div style={{ marginTop: '20px', textAlign: 'left', maxHeight: '400px', overflowY: 'auto' }}>
                        <h3>🎶 Your Music Profile</h3>
                        
                        {/* Audio Profile Summary */}
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <h4>📊 Audio Profile</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', fontSize: '14px' }}>
                                <div>Valence: <strong>{spotifyData.formatted_data.valence}</strong></div>
                                <div>Energy: <strong>{spotifyData.formatted_data.energy}</strong></div>
                                <div>Danceability: <strong>{spotifyData.formatted_data.danceability}</strong></div>
                                <div>Tempo: <strong>{spotifyData.formatted_data.tempo}</strong></div>
                            </div>
                            <div style={{ marginTop: '10px', fontSize: '14px' }}>
                                <div><strong>Top Genres:</strong> {spotifyData.formatted_data.top_genres.join(', ')}</div>
                                <div><strong>Top Artists:</strong> {spotifyData.formatted_data.top_artists.join(', ')}</div>
                            </div>
                        </div>
                        
                        {/* Top Songs Preview */}
                        <div style={{ marginBottom: '20px' }}>
                            <h4>🎵 Top Songs (Preview)</h4>
                            {spotifyData.detailed_data.songs.slice(0, 3).map((song) => (
                                <div key={song.rank} style={{
                                    backgroundColor: '#282828',
                                    color: 'white',
                                    padding: '8px',
                                    margin: '5px 0',
                                    borderRadius: '5px',
                                    fontSize: '13px'
                                }}>
                                    <div style={{ fontWeight: 'bold' }}>#{song.rank} {song.name}</div>
                                    <div style={{ color: '#b3b3b3' }}>by {song.artist}</div>
                                    <div style={{ color: '#1db954', fontSize: '11px' }}>
                                        Energy: {song.energy} | Valence: {song.valence}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <button className={StyleLinkSpotify.closeButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default LinkSpotify;