'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import { CiImageOn } from "react-icons/ci";
import PropertyImages from '@/components/PropertyImages';
import '../styles/imageModelOpener.scss'

import dummy1 from '../../public/assets/properties/DummyPropImg1.jpg'
import dummy2 from '../../public/assets/properties/DummyPropImg2.jpg'
import dummy3 from '../../public/assets/properties/DummyPropImg3.jpg'
import dummy4 from '../../public/assets/properties/DummyPropImg4.png'

export default function ImageModalOpener({ PropertyData }) {
    const [isPropertyImageOpen, setIsPropertyImageOpen] = useState(false);

    const togglePropertyImageOpen = () => {
        setIsPropertyImageOpen(prev => !prev);
    }; 

    // Safe fallback array to avoid crashes
    const images = Array.isArray(PropertyData.img) ? PropertyData.img : [];

    // Ensure at least 4 placeholders so UI doesn't break
    const safeImages = [
        images[0] || { url: dummy1 },
        images[1] || { url: dummy2 },
        images[2] || { url: dummy3 },
        images[3] || { url: dummy4 },
    ];

    useEffect(() => {
        document.body.style.overflow = isPropertyImageOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isPropertyImageOpen]);

    return (
        <>
            <div className="property_images_collage" onClick={togglePropertyImageOpen}>
                {/* Top big image */}
                <div className="property_images_collage_upper">
                    <Image src={safeImages[0].url} alt="" width={339.5} height={257} />
                </div>

                {/* Bottom collage */}
                <div className="property_images_collage_bottom">
                    <div className="property_images_collage_bottom_img_div">
                        <Image src={safeImages[1].url} alt="" width={400} height={300} />
                    </div>

                    <div className="property_images_collage_bottom_img_div">
                        <Image src={safeImages[2].url} alt="" width={400} height={300} />
                    </div>

                    {/* Last cell with +count */}
                    <div className="property_images_collage_bottom_img_div">
                        {images.length > 4? <p>
                            <CiImageOn />
                            +{images.length - 4} Photos
                        </p> : ''}
                        <Image src={safeImages[3].url} alt="" width={400} height={300} />
                    </div>
                </div>
            </div>

            {/* Fullscreen modal viewer */}
            <div className={`show_property_images ${isPropertyImageOpen ? 'open_prop_image' : ''}`}>
                <PropertyImages 
                    isImageOpen={isPropertyImageOpen} 
                    toggleImage={togglePropertyImageOpen} 
                    PropertyData={PropertyData} 
                />
            </div>
        </>
    );
}
