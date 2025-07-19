import StyleLinkSpotify from './styles/linkSpotify.module.css'


function LinkSpotify({ onClose, onLinked }) {
    // Close modal when clicking outside modalContent
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle Spotify linking
    const handleLinkSpotify = () => {
        window.open('http://127.0.0.1:5000/', '_blank');
        if (onLinked) onLinked();
    };

    return (



        <div className={StyleLinkSpotify.modal} onClick={handleOutsideClick}>
            <div className={StyleLinkSpotify.modalContent}>
                <h2>Link Spotify Account</h2>
                <button className={StyleLinkSpotify.LinkSpotifyButton} onClick={handleLinkSpotify}>Link Spotify</button>
                <button className={StyleLinkSpotify.closeButton} onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default LinkSpotify;