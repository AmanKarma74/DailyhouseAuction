"use client"
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const QuickLogin = ({ onSuccessfulLogin, onToggleView, redirectTo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // 👈 2. Loading state add ki
    const router = useRouter();


    
  const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Previous error clear kiya

        if (!email || !password) {
            setError('Email and password cannot be empty.');
            return;
        }
        setLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
        });

        setLoading(false);

        if (result.error) {
            setError('Invalid Credentials. Please check your email and password.');

        } else {
            router.push(redirectTo || '/profile'); 
        }
    };

    return (
        <form className="auth-form" onSubmit={handleLogin}>
            {error && <p className="auth-error">{error}</p>}
            
            <div className="form-group">
                <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email *" // UI from image
                    required
                    className='detail'
                />
            </div>

            <div className="form-group">
                <input
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password *" // UI from image
                    required
                    className='detail'
                />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'} 
            </button>

            <div className="formFooter">
                <p>
                By continuing, you agree to Dailyhouse's
                <b> Terms of Service, Privacy policy.</b>
                </p>
                <hr />
            </div>
            

            <p className="auth-toggle">
                
                <button type="button" onClick={onToggleView} className="toggle-link">
                   New to Dailyhouse? Sign Up
                </button>
            </p>
        </form>
    );
};

export default QuickLogin;

