"use client";

import React, { useState, useCallback } from 'react';
import QuickLogin from '@/components/Auth/QuickLogin'; // Ensure correct path
import QuickRegister from '@/components/Auth/QuickRegister'; // Ensure correct path
import '../../styles/authentication.scss'; // New SCSS for the page layout

const AuthPage = ({redirectTo}) => {
    const [isRegisterView, setIsRegisterView] = useState(true);

    // Handler to switch views
    const toggleView = useCallback(() => {
        setIsRegisterView(prev => !prev);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Placeholder for authentication success
    const handleAuthSuccess = (userData) => {
        alert(`Welcome, ${userData.name || userData.username || userData.email}!`);
    };

    return (
        <div className="auth-page-container">

            <div className="auth-card"> 
                <div className="auth-content-wrapper"> 
                    
                    <h3 className='brand-logo'>Dailyhouse</h3>
                    <h2 className="auth-header">
                        {isRegisterView ? "Sign Up to see more" : "Login to your account"}
                    </h2>

                    {/* The rest of the content (forms) */}
                    {isRegisterView ? (
                        <QuickRegister 
                            onSuccessfulRegistration={handleAuthSuccess} 
                            onToggleView={toggleView}
                            redirectTo={redirectTo} 
                        />
                    ) : (
                        <QuickLogin 
                            onSuccessfulLogin={handleAuthSuccess} 
                            onToggleView={toggleView} 
                            redirectTo={redirectTo}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
