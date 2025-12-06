"use client"
import React, { useEffect, useRef, useState } from 'react'
import '../styles/propertyImages.scss'

//Icons
import { RxCross1 } from "react-icons/rx";
import { BsArrowRight, BsArrowRightShort, BsArrowLeft } from "react-icons/bs";

function PropertyImages({isImageOpen, toggleImage, PropertyData}) {

    const cardContainerRef = useRef(null);


   const [activeCardIndex, setActiveCardIndex] = useState('')
    const handleNextCard = () => {
    setActiveCardIndex((prevIndex) => Math.min(prevIndex +1, PropertyData.img.length - 1))
    }
    const handlePreviousCard = () => {
    setActiveCardIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    }

    useEffect(() => {
    const cardContainer = cardContainerRef.current;
    cardContainer.style.transform = `translateX(-${activeCardIndex * 100}vw)`
    },[activeCardIndex])

  return (
    <div className={`main_property_image_page ${isImageOpen? 'open' : ''}`}>
        <div className="upperdiv">
          <div className="heading_count"><h3>{PropertyData.propertyCategory == 'House/Flat'? PropertyData.totalBedrooms+' BHK' : ''} {PropertyData.propertyType? PropertyData.propertyType : PropertyData.propertyCategory} for Sale in {PropertyData.location}</h3><span>{`${activeCardIndex+1}/${PropertyData.img.length}`}</span></div>
          <RxCross1 className='cross_icon' onClick={toggleImage}/>
        </div>

        <div className="main_property_image_div_container">

          <span className={activeCardIndex > 0? 'arrow_span arrow_left show_arrow' : 'arrow_span arrow_left'} onClick={handlePreviousCard}><BsArrowLeft /></span>
                              
          <div className="property_image_div" ref={cardContainerRef}>
          {PropertyData.propertyImage.map((data, index) => (
              <div key={index} className="property_image_holder">
  
                  <div className="property_image">
                    <img src={data} alt=""  />
                  </div>
  
              </div>
          ))} 
          </div>
            
          <span className={activeCardIndex < PropertyData.img.length - 1 ? 'arrow_span arrow_right show_arrow' : 'arrow_span arrow_right'} onClick={handleNextCard}><BsArrowRight /></span>
            
        </div> 
    </div>
  )
}

export default PropertyImages