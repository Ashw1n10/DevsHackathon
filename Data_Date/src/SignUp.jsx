import styleSignUp from './styles/signUp.module.css';
import Logo from './assets/Logo.png';

function SignUp() {
    return (
        <div className={styleSignUp.modal}>
            <div className={styleSignUp.modalContent}>
                <img src={Logo} alt="Logo" className={styleSignUp.logo} />
                <div className={styleSignUp.scrollableContent}>
                    <div className={styleSignUp.SignUpContainer}>
                        <input type="text" placeholder='Enter your Username' className={styleSignUp.usernameInput} />
                        <input type="password" placeholder='Enter your Password' className={styleSignUp.passwordInput} />
                        <input type="password" placeholder='Confirm Password' className={styleSignUp.confirmPasswordInput} />
                        <input type="email" placeholder='Email' className={styleSignUp.emailInput} />
                        <input type="text" placeholder='Full Name' className={styleSignUp.nameInput} />
                        <label htmlFor="gender" className={styleSignUp.label}>Select your gender</label>
                        <select name="gender" id="gender" className={styleSignUp.select}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                        </select>
                        <label htmlFor="age" className={styleSignUp.label}>Select your age</label>
                        <input type="number" id="age" name="age" min="18" max="100" placeholder='Age' className={styleSignUp.ageInput} />
                        <label htmlFor="Preference" className={styleSignUp.label}>Select your preference</label>
                        <select name="Preference" id="Preference" className={styleSignUp.select}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="any">Any</option>
                        </select>
                        <button className={styleSignUp.linkSpotifyButton}>Link Spotify</button>
                        <button className={styleSignUp.signUpButton}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;