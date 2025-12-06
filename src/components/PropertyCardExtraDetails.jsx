"use client"
import {React, useState, useEffect} from 'react'
import '../styles/propertyCardExtraDetails.scss'

//ICONS ------------------->
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

function PropertyCardExtraDetails({PropertyData, processedExtraDetails}) {

    const [isExpanded, setIsExpanded] = useState(false);
        
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    const toggleDetailsOpen = () => {
        setIsDetailsOpen(!isDetailsOpen);
    };

    //-----Responsive ---------
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
            setIsMobile(window.innerWidth <= 768)
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
            };
            window.addEventListener('resize', handleResize);
            setIsMobile(window.innerWidth <= 768); 
    
            return () => window.removeEventListener('resize', handleResize);
        }, [isMobile]);

  return (
    <>
    <div className={`extra-details-container ${isDetailsOpen ? 'is-expanded' : ''}`}>
    {isDetailsOpen && processedExtraDetails.map(item => {
        
        if (item) {
            
            return (
                <div key={item.key} className="details_wrapper extra-detail">
                    <h5 className="details_wrapper_h5">{item.label}</h5>
                    <h4 className="details_wrapper_h4">{item.value}{item.suffix || ''}</h4>
                </div>
            );
        }
        return null;
    })}
    </div>

    {isDetailsOpen ?
    <div className='open_details_button'
    onClick={toggleDetailsOpen}
    >See Less <FaAngleUp /></div>
    :
    <div className='open_details_button'
    onClick={toggleDetailsOpen}
    >See More <FaAngleDown /></div>
    }

    <div className="details_wrapper"> 
        {isMobile? 
        <h6>
            {isExpanded 
                ? PropertyData.description 
                : (PropertyData.description?.slice(0, 100) + '...')}
            
            {PropertyData.description && PropertyData.description.length > 100 && (
                    <button onClick={toggleExpand}>
                        {isExpanded ? 'Read less' : <FaAngleDown />}
                    </button>
            )}
        </h6>
        :
        <h6>
            {isExpanded 
                ? PropertyData.description 
                : (PropertyData.description?.slice(0, 170) + '...')}
            
            {PropertyData.description && PropertyData.description.length > 170 && (
                    <button onClick={toggleExpand}>
                        {isExpanded ? 'Read less' : <FaAngleDown />}
                    </button>
            )}
        </h6>
        }
    </div>
    </>
  )
}

export default PropertyCardExtraDetails