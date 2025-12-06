"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import '../styles/agentCard.scss'

//Icons
import { BsArrowRight, BsArrowRightShort, BsArrowLeft } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
import { PiBuildingOfficeDuotone } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

//Images
import house1 from '../../public/assets/properties/Indian_house.jpg'

import Billu from "../../public/assets/Billu.jpg"

function AgentCard() {

    const AgentData = [
        {
          personal: {
            name: 'Aman Karma',
            profileimg: Billu,
            age: '21',
          },
          company: {
            name: 'Prime Properties',
            location: 'Silicon City, Indore',
            listedProperties: '50',
            customerServed: '1500+',
            workingSince: '2011',
            priceRange: '25 Lakh - 2 Crore',
            officeImg: house1
          }
        },

        {
          personal: {
            name: 'Aman Karma',
            profileimg: Billu,
            age: '21',
          },
          company: {
            name: 'Prime Properties',
            location: 'Silicon City, Indore',
            listedProperties: '50',
            customerServed: '1500+',
            workingSince: '2011',
            priceRange: '25 Lakh - 2 Crore',
            officeImg: house1
          }
        },

        {
          personal: {
            name: 'Aman Karma',
            profileimg: Billu,
            age: '21',
          },
          company: {
            name: 'Prime Properties',
            location: 'Silicon City, Indore',
            listedProperties: '50',
            customerServed: '1500+',
            workingSince: '2011',
            priceRange: '25 Lakh - 2 Crore',
            officeImg: house1
          }
        },

        {
          personal: {
            name: 'Aman Karma',
            profileimg: Billu,
            age: '21',
          },
          company: {
            name: 'Prime Properties',
            location: 'Silicon City, Indore',
            listedProperties: '50',
            customerServed: '1500+',
            workingSince: '2011',
            priceRange: '25 Lakh - 2 Crore',
            officeImg: house1
          }
        },

        {
          personal: {
            name: 'Aman Karma',
            profileimg: Billu,
            age: '21',
          },
          company: {
            name: 'Prime Properties',
            location: 'Silicon City, Indore',
            listedProperties: '50',
            customerServed: '1500+',
            workingSince: '2011',
            priceRange: '25 Lakh - 2 Crore',
            officeImg: house1
          }
        },

        {
          personal: {
            name: 'Aman Karma',
            profileimg: Billu,
            age: '21',
          },
          company: {
            name: 'Prime Properties',
            location: 'Silicon City, Indore',
            listedProperties: '50',
            customerServed: '1500+',
            workingSince: '2011',
            priceRange: '25 Lakh - 2 Crore',
            officeImg: house1
          }
        },
      ];

    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const cardContainerRef = useRef(null);

    const handleNextCard = () => {
    setActiveCardIndex((prevIndex) => Math.min(prevIndex +1, AgentData.length - 4))
    }
    const handlePreviousCard = () => {
    setActiveCardIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    }

    useEffect(() => {
    const cardContainer = cardContainerRef.current;
    cardContainer.style.transform = `translateX(-${activeCardIndex * 312}px)`
    },[activeCardIndex])

  return (
    
    <section className="agent_container">

      <div className="recommend_heading_div">
              <div className="left_heading">
              <h2>Featured Dealers</h2>
              <span className='underline'></span>
              </div>
              <div className='right_heading'>See all Dealers <IoIosArrowRoundForward className='short_icon' /></div>
      </div>

       <span className={activeCardIndex > 0? 'arrow_span arrow_left show_arrow' : 'arrow_span arrow_left'} onClick={handlePreviousCard}><BsArrowLeft /></span>
      <div className="recommend_agent_cards_div" >

        <div className="agent_card_slider" ref={cardContainerRef}>
        {AgentData.map((data, index) => (
            <div key={index} className="card_holder_div">

                <div className='main_container_agent' >
                    <div className='upperdiv'>
                        <Image src={data.personal.profileimg} alt="preview" />
                        <div className="agent_name_div">
                            <p>PP Preferred</p>
                            <h6>{data.personal.name}</h6>
                        </div>
                        <span className="verified_batch"><RiVerifiedBadgeFill /></span>
                    </div>
            
                    <div className='lowerdiv'>

                        <div className='lowerdiv_company_div border'> 

                            <div className="office_img">
                            <Image src={data.company.officeImg} alt="" />
                            </div>
                            
                            <div className='company_info'>
                              <h6>{data.company.name}</h6>
                              <div>
                                  <span>Operating Since <br /> {data.company.workingSince}</span>
                                  <span className='height'>|</span>
                                  <span>Buyers Served <br /> {data.company.customerServed}</span>
                              </div>
                            </div>

                        </div>

                        <div className='lowerdiv_contact_div'> 
                                <h6>{data.company.listedProperties}+ Properties Available</h6>
                                <p className='lowerdiv_contact_div_p'><PiBuildingOfficeDuotone className='icon'/> {data.company.location}</p>
                                <button className="button">View Properties</button>
                        </div>

                    </div>
                </div>

            </div>
        ))}
        </div>

      </div>
       <span className={activeCardIndex < AgentData.length - 4 ? 'arrow_span arrow_right show_arrow' : 'arrow_span arrow_right'} onClick={handleNextCard}><BsArrowRight /></span>

    </section>

    )
}

export default AgentCard;