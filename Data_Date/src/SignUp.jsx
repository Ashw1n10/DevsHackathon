import { useState } from 'react';
import LinkSpotify from './LinkSpotify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import styleSignUp from './styles/signUp.module.css';
import Logo from './assets/Logo.png';

function SignUp({ onClose }) {
    // State for form data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        fullName: '',
        gender: 'male',
        age: '',
        preference: 'male'
    });

    // State for loading and error handling
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [spotifyLinked, setSpotifyLinked] = useState(false);
    const [showLinkSpotify, setShowLinkSpotify] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validate form data
    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.username || !formData.fullName) {
            setError('Please fill in all required fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
            setError('Age must be between 18 and 100');
            return false;
        }

        return true;
    };

    // Handle Spotify linking (not used directly anymore)
    const handleLinkSpotify = () => {
        setShowLinkSpotify(true);
    };

    // Handle sign up
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // Save additional user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                gender: formData.gender,
                age: parseInt(formData.age),
                preference: formData.preference,
                spotifyLinked: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log('User created successfully:', user.uid);


            // Instead of creating the user now, show the LinkSpotify modal
            setShowLinkSpotify(true);
            console.log('SignUp button pressed, showLinkSpotify set to true');

        } catch (error) {
            console.error('Error creating user:', error);

            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak');
                    break;
                default:
                    setError('An error occurred during sign up. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // This will be called after Spotify linking is done, NEED TO DO THIS WHEN CLICKING SIGN IN
    const handleSpotifyLinked = async () => {
        setShowLinkSpotify(false);
        setLoading(true);
        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // Save additional user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                gender: formData.gender,
                age: parseInt(formData.age),
                preference: formData.preference,
                spotifyLinked: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log('User created successfully:', user.uid);

            // Close the modal on successful signup
            onClose();

        } catch (error) {
            console.error('Error creating user:', error);

            // Handle specific Firebase errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak');
                    break;
                default:
                    setError('An error occurred during sign up. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Close modal when clicking outside modalContent
    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            {showLinkSpotify ? (
                <LinkSpotify 
                    onClose={() => setShowLinkSpotify(false)}
                    onLinked={handleSpotifyLinked}
                />
            ) : (
                <div className={styleSignUp.modal + ' ' + styleSignUp.fade} onClick={handleOutsideClick}>
                    <div className={styleSignUp.modalContent}>
                        <img src={Logo} alt="Logo" className={styleSignUp.logo} />
                        <div className={styleSignUp.scrollableContent}>
                            <div className={styleSignUp.SignUpContainer}>
                                {error && <div className={styleSignUp.error}>{error}</div>}
                                <form onSubmit={handleSignUp}>
                                    <input 
                                        type="text" 
                                        name="username"
                                        placeholder='Enter your Username' 
                                        className={styleSignUp.usernameInput}
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input 
                                        type="password" 
                                        name="password"
                                        placeholder='Enter your Password' 
                                        className={styleSignUp.passwordInput}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        placeholder='Confirm Password' 
                                        className={styleSignUp.confirmPasswordInput}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input 
                                        type="email" 
                                        name="email"
                                        placeholder='Email' 
                                        className={styleSignUp.emailInput}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        placeholder='Full Name' 
                                        className={styleSignUp.nameInput}
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="gender" className={styleSignUp.label}>Select your gender</label>
                                    <select 
                                        name="gender" 
                                        id="gender" 
                                        className={styleSignUp.select}
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="Non-binary">Non-binary</option>
                                    </select>
                                    <label htmlFor="age" className={styleSignUp.label}>Select your age</label>
                                    <input 
                                        type="number" 
                                        id="age" 
                                        name="age" 
                                        min="18" 
                                        max="100" 
                                        placeholder='Age' 
                                        className={styleSignUp.ageInput}
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="preference" className={styleSignUp.label}>Select your preference</label>
                                    <select 
                                        name="preference" 
                                        id="preference" 
                                        className={styleSignUp.select}
                                        value={formData.preference}
                                        onChange={handleInputChange}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="Non-binary">Non-binary</option>
                                        <option value="any">Any</option>
                                    </select>
                                    <button 
                                        type="submit"
                                        className={styleSignUp.signUpButton}
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Sign Up'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SignUp;