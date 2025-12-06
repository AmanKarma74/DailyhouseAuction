"use client"
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // This hook provides the current location object (pathname, search, hash, etc.)
    const { pathname } = useLocation();

    useEffect(() => {
        // When the 'pathname' (the route) changes, this effect runs.
        window.scrollTo(0, 0); 
    }, [pathname]); // Reruns the effect whenever the route changes

    // This component does not render any visible HTML, it only handles side effects.
    return null; 
};

export default ScrollToTop;