import React from 'react'
import Image from 'next/image';
import '../styles/adOnSearchPage.scss'

//ICONS 
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

//IMAGES
import home_showcase from '../../public/assets/home_showcase.png'
import sbi_logo from '../../public/assets/SBI_logo.png'


function AdOnSearchPage() {
  return (
  <div className="adonsearchpage_main">

    {/* POST PROPERTY AD */}
    <div className="post_property_ad_container">
      <div className='ad_heading'>
        <h2>Sell/Rent your Property with us for <b>Free</b></h2>
      </div>
      <h4>Find Buyers & Tenants easily</h4>
      <div className="post_button">
        Post Property
      </div>
      <div className="why_us">
        <h3>Here's why Dailyhouse:</h3>
        <ul>
          <li><span><IoIosCheckmarkCircleOutline/></span>Get Access to 4 Lakh + Buyers</li>
          <li><span><IoIosCheckmarkCircleOutline/></span>Sell Faster with Premium Service</li>
          <li><span><IoIosCheckmarkCircleOutline/></span>Find only Genuine Leads</li>
          <li><span><IoIosCheckmarkCircleOutline/></span>Get Expert Advice on Market Trends & insights</li>
        </ul>
      </div>
    </div>

    {/* SBI LOAN AD */}
    <div className="sbi_ad_container">
      <div className="sbi_logo"> <Image src={sbi_logo} alt="SBI" /></div>
      <div className="loan_heading">Exclusive Interest rate starting from <b>8.5% p.a.</b> </div>
      <span>+</span>
      <div className="loan_heading"> Loan tenure upto <b>30 years</b></div>
      <div className="apply_button">Apply with Dailyhouse</div>
      <div className="hands_png"> <Image src={home_showcase} alt="home" /></div>
    </div>
    
  </div>
  )
}

export default AdOnSearchPage