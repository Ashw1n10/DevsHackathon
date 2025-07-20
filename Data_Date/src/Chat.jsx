import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Chat.module.css';
import Logo from './assets/Logo.png';

function Chat() {
  const navigate = useNavigate();

  // Navigation handlers
  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleMatchesClick = () => {
    navigate('/matches');
  };

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
    <div className={styles['chat-container']}>
      {/* Navigation */}
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <div>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </div>
          <button onClick={handleHomeClick} className={styles.about}>Home</button>
          <button onClick={handleProfileClick} className={styles.about}>Profile</button>
          <button onClick={handleMatchesClick} className={styles.about}>🎵 Matches</button>
        </div>
        <button className={styles.login}>Login</button>
      </div>

      {/* Chat Header */}
      <div className={styles['chat-header']}>
        <div className={styles['match-info']}>
          <div className={styles['match-avatar']}>👩‍🎤</div>
          <div className={styles['match-details']}>
            <h2>Sarah</h2>
            <p>95% Music Match • Online</p>
            <div className={styles['shared-artists']}>
              <span>🎵 Shared: The Weeknd, Dua Lipa, Harry Styles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className={styles['messages-container']}>
        {messages.map((message) => (
          <div key={message.id} className={`${styles.message} ${message.isUser ? styles.user : styles.other}`}>
            <div className={styles['message-avatar']}>{message.avatar}</div>
            <div className={styles['message-content']}>
              <div className={styles['message-bubble']}>
                <p>{message.content}</p>
              </div>
              <div className={styles['message-timestamp']}>{message.timestamp}</div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className={`${styles.message} ${styles.other}`}>
            <div className={styles['message-avatar']}>👩‍🎤</div>
            <div className={styles['message-content']}>
              <div className={styles['typing-indicator']}>
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
      <div className={styles['message-input-container']}>
        <form onSubmit={handleSendMessage} className={styles['message-form']}>
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message about music..."
            className={styles['message-input']}
          />
          <button type="submit" className={styles['send-button']}>
            🎵 Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
