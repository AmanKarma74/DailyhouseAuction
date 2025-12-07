"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import '../styles/categoryCard.scss'

//Icons
import { BsArrowRight, BsArrowRightShort, BsArrowLeft } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
//Images
import land from '../../public/assets/categories/category_land.webp'
import apartment from '../../public/assets/categories/category_apartment.webp'
import villa from '../../public/assets/categories/category_villa.webp'
import independent from '../../public/assets/categories/category_independent.webp'
import farmhouse from '../../public/assets/categories/category_farmhouse.webp'
import rk from '../../public/assets/categories/category_rk.webp'

function CategoryCard() {

    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const cardContainerRef = useRef(null);

    const Categories = [
      {
        name: 'Residential Land',
        image: land,
        properties: '1245+',
        color: '#FFF5E4',
        url: '/search?category=Land&purpose=Sell&type=Residential+Land&tab=Land',
      },
      
      {
        name: 'Residential Apartment',
        image: apartment,
        properties: '1245+',
        color: '#F0F9FF',
        url: '/search?category=Residential&purpose=Sell&type=Flat&tab=Residential'
      },
      {
        name: 'Independent Bunglow/ Villa',
        image: villa,
        properties: '1245+',
        color: '#D7F2E3',
        url: '/search?category=Residential&purpose=Sell&type=Villa&tab=Residential'
      },
      {
        name: 'Independent House',
        image: independent,
        properties: '1245+',
        color: '#FFF5E4',
        url: '/search?category=Residential&purpose=Sell&type=House&tab=Residential'
      },
      {
        name: 'Farm House',
        image: farmhouse,
        properties: '1245+',
        color: '#F0F9FF',
        url: '/search?category=Residential&purpose=Sell&type=Farmhouse&tab=Residential'
      },
      {
        name: 'Office Space',
        image: rk,
        properties: '1245+',
        color: '#D7F2E3',
        url: '/search?category=Commercial&purpose=Sell&type=Office+Space&tab=Commercial'
      },

    ];

    const handleNextCard = () => {
    setActiveCardIndex((prevIndex) => Math.min(prevIndex +1, Categories.length - 4))
    }
    const handlePreviousCard = () => {
    setActiveCardIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    }

    useEffect(() => {
    const cardContainer = cardContainerRef.current;
    cardContainer.style.transform = `translateX(-${activeCardIndex * 279}px)`
    },[activeCardIndex])

  return (
    
    <section className="category_container">

      <div className="recommend_heading_div">
              <div className="left_heading">
              <h2>Categories</h2>
              <span className='underline'></span>
              </div>
              <div className='right_heading'>See all Categories <IoIosArrowRoundForward className='short_icon' /></div>
      </div>

       <span className={activeCardIndex > 0? 'arrow_span arrow_left show_arrow' : 'arrow_span arrow_left'} onClick={handlePreviousCard}><BsArrowLeft /></span>
      <div className="recommend_category_cards_div" >

        <div className="category_card_slider" ref={cardContainerRef}>
        {Categories.map((data, index) => (
          <Link href={data.url} key={index}>
            <div key={index} className="card_holder_div">

                <div className="main_container" style={{backgroundColor: `${data.color}`}}>
                  <Image src={data.image} alt="" />
                  <div className="category_name_div">
                    <h3>{data.name}</h3>
                    <p>{data.properties} Properties</p>
                  </div>
                </div>

            </div>
          </Link>
        ))}
        </div>

      </div>
       <span className={activeCardIndex < Categories.length - 4 ? 'arrow_span arrow_right show_arrow' : 'arrow_span arrow_right'} onClick={handleNextCard}><BsArrowRight /></span>

    </section>

    )
}

export default CategoryCard;