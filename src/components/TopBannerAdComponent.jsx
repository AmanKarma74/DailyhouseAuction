"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '../styles/topBannerAd.scss'; 

// Utils------------------------->
import topBanner from '../../public/assets/top_banner.jpg'
import house1 from '../../public/assets/properties/Indian_house.jpg'
import house2 from '../../public/assets/properties/house.jpg'
import house3 from '../../public/assets/properties/apartment.jpg'
import house4 from '../../public/assets/properties/luxury_house.jpg'
import house5 from '../../public/assets/properties/luxury_flat.jpg'
import house6 from '../../public/assets/properties/luxury_house2.jpg'
import house7 from '../../public/assets/properties/luxury_villa.jpg'

const imagesForMobile = [
    { id: '2', img: house2, link: "/search/id='03'" },
    { id: '3', img: house3, link: "/search/id='04'" },
    { id: '4', img: house4, link: "/search/id='05'" },
    { id: '7', img: house7, link: "/search/id='02'" },
];
const imagesForDesktop = [
    { id: '1', img: topBanner, link: "/search/id='01'" },
    { id: '2', img: house4, link: "/search/id='02'" },
    { id: '3', img: house5, link: "/search/id='03'" },
    { id: '4', img: house6, link: "/search/id='04'" },
    { id: '5', img: house7, link: "/search/id='05'" },
];

const MOBILE_BREAKPOINT = 768;


function TopBannerAdComponent() {

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState(imagesForDesktop);
    const [isDesktop, setIsDesktop] = useState(true);
    const intervalRef = useRef(null); 
    const [isSliding, setIsSliding] = useState(true); 

    const touchStartX = useRef(0);
    const SWIPE_THRESHOLD = 50; // Minimum pixels jise hum swipe maanege

    const goToSlide = (index) => {
        setCurrentSlideIndex(index);
        setIsSliding(false);
        setTimeout(() => setIsSliding(true), 500); // 0.5 seconds baad resume
    };


    // --- Helper Functions for Navigation ---
    const goToNextSlide = () => {
        setCurrentSlideIndex(prevIndex => (prevIndex + 1) % currentImages.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlideIndex(prevIndex => (prevIndex - 1 + currentImages.length) % currentImages.length);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT)
            const newIsDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
            if (newIsDesktop !== isDesktop) {
                setIsDesktop(newIsDesktop);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [isDesktop]);

    
    useEffect(() => {
        const newImages = isDesktop ? imagesForDesktop : imagesForMobile;
        
        if (newImages !== currentImages) {
            setCurrentImages(newImages);
            setCurrentSlideIndex(0); 
        }
        setIsSliding(true);
    }, [isDesktop]); 


    useEffect(() => {
        if (!isSliding || currentImages.length === 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        const intervalId = setInterval(() => {
            setCurrentSlideIndex(prevIndex => (prevIndex + 1) % currentImages.length);
        }, 3000);
        
        intervalRef.current = intervalId;

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [currentImages, isSliding]); 


    const handleMouseEnter = () => {
        if (isDesktop) {
            setIsSliding(false);
        }
    };
    const handleMouseLeave = () => {
        if (isDesktop) {
            setIsSliding(true);
        }
    };

    const handleTouchStart = (e) => {
        if (!isDesktop) {
            touchStartX.current = e.touches[0].clientX;
            setIsSliding(false); // Mobile par touch karte hi auto-slide stop ho
        }
    };
    const handleTouchEnd = (e) => {
        if (!isDesktop) {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX.current - touchEndX; // Start - End = Left swipe
            
            if (Math.abs(diff) > SWIPE_THRESHOLD) {
                // Agar difference positive hai, toh Left swipe (Next slide)
                if (diff > 0) {
                    goToNextSlide();
                } 
                // Agar difference negative hai, toh Right swipe (Previous slide)
                else {
                    goToPrevSlide();
                }
            }
            setIsSliding(true); // Touch chhodte hi auto-slide resume ho
        }
    };

    const currentSlide = currentImages[currentSlideIndex];
    if (!currentSlide) return <div className="topBanner">Loading...</div>; 
    

    return (
        <div 
            className="topBanner"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}

            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="banner_link_wrapper">
                <Image 
                    src={currentSlide.img} 
                    alt={`Banner Ad Slide ${currentSlideIndex + 1}`} 
                />
            </div>

            {isDesktop && (
                <div className="dots_container">
                    {/* currentImages array ki length ke hisaab se dots map karo */}
                    {currentImages.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${currentSlideIndex === index ? 'active' : ''}`}
                            onClick={() => goToSlide(index)} // 🆕 2. Click handler
                        ></div>
                    ))}
                </div>
            )}

        </div>
    );
}



export default TopBannerAdComponent;