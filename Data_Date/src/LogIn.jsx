import styleLogin from './styles/logIn.module.css'
import Logo from './assets/Logo.png'

function LogIn({ onClose, onSignUp }) {
    // Close modal when clicking outside modalContent
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div className={styleLogin.modal} onClick={handleOutsideClick}>
            <div className={styleLogin.modalContent}>
                <img src={Logo} alt="Logo" className={styleLogin.logo} />
                <div className={styleLogin.logInContainer}>
                    <input type="text" placeholder='Username' className={styleLogin.usernameInput} />
                    <input type="password" placeholder='Password' className={styleLogin.passwordInput} />
                    <button className={styleLogin.logInButton}>Log In</button>
                    <p className={styleLogin.registerText}>
                        Don't have an account?{' '}
                        <a href="#" className={styleLogin.registerLink} onClick={e => { e.preventDefault(); onSignUp(); }}>Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LogIn