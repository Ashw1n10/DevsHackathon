import styleLogin from './styles/logIn.module.css'
import Logo from './assets/Logo.png'

function LogIn() {
    return (
    <>


    <div className={styleLogin.modal}>
        <div className={styleLogin.modalContent}>
            <img src={Logo} alt="Logo" className={styleLogin.logo} />
            <div className={styleLogin.logInContainer}>
                <input type="text" placeholder='Username' className={styleLogin.usernameInput} />
                <input type="password" placeholder='Password' className={styleLogin.passwordInput} />
                <button className={styleLogin.logInButton}>Log In</button>
                <p className={styleLogin.registerText}>Don't have an account? <a href="/signup" className={styleLogin.registerLink}>Sign Up</a></p>
            </div>
        </div>
    </div>

    
    
    
    </>)
}

export default LogIn