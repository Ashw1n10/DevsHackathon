import './styles/signUp.css';
import Logo from './assets/Logo.png';

function SignUp() {
    return (
        <div className='modal'>
            <div className='modalContent'>

                <img src={Logo} alt="Logo" className="logo" />

                <div className='scrollableContent'>
                    <div className='SignUpContainer'>
                        <input type="text" placeholder='Enter your Username' className='usernameInput' />
                        <input type="password" placeholder='Enter your Password' className='passwordInput' />
                        <input type="password" placeholder='Confirm Password' className='confirmPasswordInput' />
                        <input type="email" placeholder='Email' className='emailInput' />
                        <input type="text" placeholder='Full Name' className='nameInput' />
                        
                        <label htmlFor="gender">Select your gender</label>
                        <select name="gender" id="gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                        </select>

                        <label htmlFor="age">Select your age</label>
                        <input type="number" id="age" name="age" min="18" max="100" placeholder='Age' className='ageInput' />

                        <label htmlFor="Preference">Select your preference</label>
                        <select name="Preference" id="Preference">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="any">Any</option>
                        </select>

                        <button>Link Spotify</button>
                        <button className='SignUp'>Sign Up</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SignUp;