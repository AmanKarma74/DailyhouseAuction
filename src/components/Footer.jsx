import React from 'react'
import '../styles/footer.scss'

import { FiInstagram } from "react-icons/fi";
import { GrFacebookOption } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";

function Footer() {
 return (
  <section className="mainContainer">
    <div className="mainDiv">

      <div className='linkContainer'>
        <div>
          <h3>logo</h3>
          <li>Mobile Apps</li>
          <li>Our Services</li>
          <li>Post your Property</li>
          <li>Area Converter</li>
          <li>Articles</li>
        </div>
        <div>
          <h3>Dailyhouse</h3>
          <li>About us</li>
          <li>Contact us</li>
          <li>Terms & Conditions</li>
          <li>Feedback</li>
          <li>Testimonials</li>
        </div>
        <div>
          <h3>Network Sites</h3>
          <li>Indore</li>
          <li>Bhopal</li>
          <li>Jabalpur</li>
          <li>Gwalior</li>
          <li>Ujjain</li>
        </div>
      </div>

      <div className='contactContainer'>
        <div className='contactus'>
          <h3>Contact Us</h3>
          <p>Toll Free - 1800 41 99099</p>
          <li>Email - feedback@companyname.com</li>
        </div>

        <div className='socialdiv'>
          <h3>Connect with us</h3>
          <div className="socialicons">
            <GrFacebookOption />
            <FaYoutube />
            <FaTwitter />
            <FiInstagram />
          </div>
        </div>

        <div className='downloaddiv'>
          <h3>Download the App</h3>
          <div className='downloaddiv_data'>
            
            <div className="downloaddiv_data_imgs">
            <img className='downloadicon' src="https://static.99acres.com/universalapp/img/Play.png" alt="Google Play Store" />
            <img className='downloadicon' src="https://static.99acres.com/universalapp/img/ios.png" alt="Apple App Store" />
            </div>
            
            <p className='usagePolicy'>
             Usage of dailyhouse.com to upload content showing area in non standard units or which enables targeting by religion/community/caste/race is prohibited. 
                            Please report inappropriate content by writing to us at <span className='reportLink'>report abuse</span>
            </p>
          </div>
        </div>
                
        <div className='copyrightDiv'>
          <p className='copyrightText'>
            All trademarks are the property of their respective owners. <br />
            All rights reserved - Dailyhouse (India) Ltd.
          </p>
        </div>
      </div>

    </div>
  </section>
 )
}

export default Footer;