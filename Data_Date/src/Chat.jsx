import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './styles/Chat.module.css';
import styles from './styles/MatchesPage.module.css';
import Logo from './assets/Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';

function Chat({ onNavigate = () => {} }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Sarah',
      content: 'Hey! I saw you like The Weeknd too! 🎵',
      timestamp: '2:30 PM',
      isUser: false,
      avatar: '👩‍🎤'
    },
    {
      id: 2,
      sender: 'You',
      content: 'Yes! Blinding Lights is my favorite song right now',
      timestamp: '2:32 PM',
      isUser: true,
      avatar: '🎧'
    },
    {
      id: 3,
      sender: 'Sarah',
      content: 'Same here! Want to check out that new album together?',
      timestamp: '2:33 PM',
      isUser: false,
      avatar: '👩‍🎤'
    }
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
      avatar: '🎧'
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response
      const responses = [
        "That sounds amazing! 🎶",
        "I love that song too!",
        "We have such similar music taste 💕",
        "Want to share playlists?",
        "That artist is incredible live!",
        "Haha, totally agree! 😄",
        "Really? Tell me more about that!",
        "Oh wow, I never thought of it that way!",
        "You seem really cool! 😊",
        "What do you like to do besides listening to music?",
        "I'm so glad we matched!",
        "Do you have any hobbies?",
        "That's so interesting!",
        "I love your energy! ✨",
        "What's your favorite place to hang out?",
        "Do you like going to concerts?",
        "That made me smile! 😊",
        "You're really funny! 😂",
        "I'd love to hear more stories from you",
        "What's been the highlight of your week?",
        "Do you like coffee or tea?",
        "That's such a cool perspective!",
        "I'm having such a great time chatting with you!",
        "What kind of movies do you like?",
        "Are you more of a morning or night person?",
        "That sounds like so much fun!",
        "I wish I could try that too!",
        "You have great taste! 👌",
        "What's your dream vacation spot?",
        "Do you cook or prefer takeout?",
        "I love how passionate you are about things!",
        "What's something you're looking forward to?",
        "You seem like someone I'd really get along with! 💫"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage = {
        id: messages.length + 2,
        sender: 'Sarah',
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        avatar: '👩‍🎤'
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  return (
    <div className={style.chatContainer}>
      {/* Navbar from MatchesPage */}
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <div>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </div>
        </div>
        <div className={styles.navBtns}>
          <button className={styles.login} onClick={() => navigate('/chat')}>
            <ChatIcon className={styles.icon} />
          </button>
          <button className={styles.login} onClick={() => navigate('/matches')}>
            <PersonIcon className={styles.icon} />
          </button>
          <button className={styles.login}>
            <SettingsIcon className={styles.icon} />
          </button>
        </div>
      </div>

      {/* Chat Header */}
      <div className={style.chatHeader}>
        <div className={style.matchInfo}>
          <div className={style.matchAvatar}>👩‍🎤</div>
          <div className={style.matchDetails}>
            <h2>Sarah</h2>
            <p>95% Music Match • Online</p>
            <div className={style.sharedArtists}>
              <span>🎵 Shared: The Weeknd, Dua Lipa, Harry Styles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className={style.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={
            message.isUser
              ? `${style.message} ${style.user}`
              : `${style.message} ${style.other}`
          }>
            <div className={style.messageAvatar}>{message.avatar}</div>
            <div className={style.messageContent}>
              <div className={style.messageBubble}>
                <p>{message.content}</p>
              </div>
              <div className={style.messageTimestamp}>{message.timestamp}</div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className={`${style.message} ${style.other}`}>
            <div className={style.messageAvatar}>👩‍🎤</div>
            <div className={style.messageContent}>
              <div className={style.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={style.messageInputContainer}>
        <form onSubmit={handleSendMessage} className={style.messageForm}>
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message about music..."
            className={style.messageInput}
          />
          <button type="submit" className={style.sendButton}>
            🎵 Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
