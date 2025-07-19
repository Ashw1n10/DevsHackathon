import './styles/logIn.css'
import Logo from './assets/Logo.png'

function LogIn() {
    return (
    <>

    <div className='modal'>

        <div className='modalContent'>
        <img src={Logo} alt="Logo" className="logo" />
        
        <div className='LogInContainer'>
            <input type="text" placeholder='Username' className='usernameInput' />
            <input type="password" placeholder='Password' className='passwordInput' />
            <button className='logInButton'>Log In</button>
            <p className='registerText'>Don't have an account? <a href="/signup" className='registerLink'>Sign Up</a></p>
        </div>

    </div>

    </div>

    
    
    
    </>)
}

export default LogIn