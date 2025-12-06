"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import '../styles/localityCard.scss'
import Link from 'next/link';

//Icons
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMdStar } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
//Images
import house1 from '../../public/assets/properties/Indian_house.jpg'
import house2 from '../../public/assets/properties/house.jpg'
import house3 from '../../public/assets/properties/apartment.jpg'
import house4 from '../../public/assets/properties/luxury_house.jpg'
import house5 from '../../public/assets/properties/luxury_flat.jpg'
import house6 from '../../public/assets/properties/luxury_house2.jpg'
import house7 from '../../public/assets/properties/luxury_villa.jpg'
import house8 from '../../public/assets/properties/luxury_villa.jpg'

function LocalityCard() {

    const LocalityData = [
        {
          img: house1,
          rating: '4.6',
          location: 'Bhawar Kuan Square, Indore',
          residentialLink: '/search?category=Residential&purpose=Sell&locations=Bhawar+Kuan%2CBholaram%2CTower+Square%2CSindhi+Colony&tab=Residential',
          commercialLink: '/search?category=Commercial&purpose=Sell&locations=Bhawar+Kuan%2CBholaram%2CTower+Square%2CSindhi+Colony&tab=Commercial',
          newProjectLink: '/search?category=New+Project&purpose=Sell&locations=Bhawar+Kuan%2CBholaram%2CTower+Square%2CSindhi+Colony&tab=New+Project',
        },
        {
          img: house2,
          rating: '4.9',
          location: 'Silicon City, Indore',
          residentialLink: '/search?category=Residential&purpose=Sell&locations=Silicon+City%2CPulak+City%2CStar+City%2CShiv+City&tab=Residential',
          commercialLink: '/search?category=Commercial&purpose=Sell&locations=Silicon+City%2CPulak+City%2CStar+City%2CShiv+City&tab=Commercial',
          newProjectLink: '/search?category=New+Project&purpose=Sell&locations=Silicon+City%2CPulak+City%2CStar+City%2CShiv+City&tab=New+Project',
        },
        {
          img: house3,
          rating: '4.2',
          location: 'Geeta Bhawan, Indore',
          residentialLink: '/search?category=Residential&purpose=Sell&locations=Geeta+Bhawan%2CGeeta+Bhawan+Square&tab=Residential',
          commercialLink: '/search?category=Commercial&purpose=Sell&locations=Geeta+Bhawan%2CGeeta+Bhawan+Square&tab=Commercial',
          newProjectLink: '/search?category=New+Project&purpose=Sell&locations=Geeta+Bhawan%2CGeeta+Bhawan+Square&tab=New+Project',
        },
        {
          img: house4,
          rating: '4.5',
          location: 'LIG Square, Indore',
          residentialLink: '/search?category=Residential&purpose=Sell&locations=LIG+Square%2CLIG%2CIndustrial+Area&tab=Residential',
          commercialLink: '/search?category=Commercial&purpose=Sell&locations=LIG+Square%2CLIG%2CIndustrial+Area&tab=Commercial',
          newProjectLink: '/search?category=New+Project&purpose=Sell&locations=LIG+Square%2CLIG%2CIndustrial+Area&tab=New+Project',
        },
        {
          img: house5,
          rating: '4.1',
          location: 'Robot Square, Indore',
          residentialLink: '/search?category=Residential&purpose=Sell&locations=Robot+Square%2CMR+10%2CRedission&tab=Residential',
          commercialLink: '/search?category=Commercial&purpose=Sell&locations=Robot+Square%2CMR+10%2CRedission&tab=Commercial',
          newProjectLink: '/search?category=New+Project&purpose=Sell&locations=Robot+Square%2CMR+10%2CRedission&tab=New+Project',
        },
        {
          img: house6,
          rating: '4.9',
          location: 'Vijay Nagar, Indore',
          residentialLink: '/search?category=Residential&purpose=Sell&locations=Vijay+Nagar%2CMahalaxmi+Nagar%2CScheme+No+74%2CScheme+No+54&tab=Residential',
          commercialLink: '/search?category=Commercial&purpose=Sell&locations=Vijay+Nagar%2CMahalaxmi+Nagar%2CScheme+No+74%2CScheme+No+54&tab=Commercial',
          newProjectLink: '/search?category=New+Project&purpose=Sell&locations=Vijay+Nagar%2CMahalaxmi+Nagar%2CScheme+No+74%2CScheme+No+54&tab=New+Project',
        },
        {
          img: house7,
          rating: '4.6',
          location: 'Rajendra Nagar, Indore',
          residentialLink: '/search?category=Residential&purpose=Sell&locations=Rajendra+Nagar%2CReti+Mandi%2CChameli+Devi+School&tab=Residential',
          commercialLink: '/search?category=Commercial&purpose=Sell&locations=Rajendra+Nagar%2CReti+Mandi%2CChameli+Devi+School&tab=Commercial',
          newProjectLink: '/search?category=New+Project&purpose=Sell&locations=Rajendra+Nagar%2CReti+Mandi%2CChameli+Devi+School&tab=New+Project',
        },
        {
          img: house8,
          rating: '4.6',
          location: 'Annanpurna Nagar, Indore',
          residentialLink: '/search?category=Residential&purpose=Sell&locations=Annanpurna+Nagar%2CSudama+Nagar%2CVaishali+Nagar%2CDwarkapuri&tab=Residential',
          commercialLink: '/search?category=Commercial&purpose=Sell&locations=Annanpurna+Nagar%2CSudama+Nagar%2CVaishali+Nagar%2CDwarkapuri&tab=Commercial',
          newProjectLink: '/search?category=New+Project&purpose=Sell&locations=Annanpurna+Nagar%2CSudama+Nagar%2CVaishali+Nagar%2CDwarkapuri&tab=New+Project',
        },
      ];

    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const cardContainerRef = useRef(null);

    const handleNextCard = () => {
    setActiveCardIndex((prevIndex) => Math.min(prevIndex +1, LocalityData.length - 4))
    }
    const handlePreviousCard = () => {
    setActiveCardIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    }

    useEffect(() => {
    const cardContainer = cardContainerRef.current;
    cardContainer.style.transform = `translateX(-${activeCardIndex * 312}px)`
    },[activeCardIndex])

  return (
    
    <section className="locality_container">

      <div className="recommend_heading_div">
              <div className="left_heading">
              <h2>Top Localities</h2>
              <span className='underline'></span>
              </div>
              <div className='right_heading'>See all Localities <IoIosArrowRoundForward className='short_icon' /></div>
      </div>

       <span className={activeCardIndex > 0? 'arrow_span arrow_left show_arrow' : 'arrow_span arrow_left'} onClick={handlePreviousCard}><BsArrowLeft /></span>
      <div className="recommend_locality_cards_div" >

        <div className="locality_card_slider" ref={cardContainerRef}>
        {LocalityData.map((data, index) => (
            <div key={index} className="card_holder_div">

                <div className='main_container_locality' >
                    <div className='upperdiv'>
                        <Image src={data.img} alt="preview" />
                        <div className="location_name_div">
                            <h6>{data.location}</h6>
                            <span className='rating'><IoMdStar className='star_icon' /> {data.rating}</span>
                        </div>
                    </div>
            
                    <div className='lowerdiv'>

                      <Link href={data.residentialLink}>
                        <div className='lowerdiv_content'> 
                            <div>
                            <h6>Residential Properties</h6>
                            <p>in {data.location}</p>
                            </div>
                            <span><MdOutlineKeyboardArrowRight /></span>
                        </div>
                      </Link>

                      <Link href={data.commercialLink}>
                        <div className='lowerdiv_content border'> 
                            <div>
                            <h6>Commercial Properties</h6>
                            <p>in {data.location}</p>
                            </div>
                            <span><MdOutlineKeyboardArrowRight /></span>
                        </div>
                      </Link>

                      <Link href={data.newProjectLink}>
                        <div className='lowerdiv_content'> 
                            <div>
                                <h6>New Projects</h6>
                                <p>in {data.location}</p>
                            </div>
                            <span><MdOutlineKeyboardArrowRight /></span>
                        </div>
                      </Link>

                    </div>
                </div>

            </div>
        ))}
        </div>

      </div>
       <span className={activeCardIndex < LocalityData.length - 4 ? 'arrow_span arrow_right show_arrow' : 'arrow_span arrow_right'} onClick={handleNextCard}><BsArrowRight /></span>

    </section>

    )
}

export default LocalityCard