"use client"
import React, { useState } from 'react'
import '../styles/sidebar.scss'

// Icons
import { FaUserCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoPlaySharp, IoSearchOutline } from "react-icons/io5";

function Sidebar({ isOpen, onClose }) {
    
  const [searchTerm, setSearchTerm] = useState('')


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    };

    
  return (
    <section className={`sidebar ${isOpen ? 'open' : ''}`}>


    <div className="sidebar_container">

        <div className='sidebar_nav'>          
            <div> <span><FaUserCircle /></span> LOGIN / REGISTER</div>
            <span onClick={onClose}><RxCross2 /></span>
        </div>

        <div className='sidebar_menu'>

            <div className='side_post'>Post Property <p>FREE</p></div>

            <hr />

            <div className='side_service'> Explore our Services </div>

            <hr />

            <div className='side_offering_div'>
                <div className='side_offer'> <span><IoPlaySharp/></span> For Buyers</div>
                <div className='side_offer'> <span><IoPlaySharp/></span> For Tenants</div>
                <div className='side_offer'> <span><IoPlaySharp/></span> For Owners</div>
                <div className='side_offer'> <span><IoPlaySharp/></span> For Dealers / Builders</div>
            </div>
            <hr />
            <div className='side_offering_div2'>
                <div className='side_offer'> <pre>  </pre> Home Loans</div>
                <div className='dimcolor side_offer'> <span><IoPlaySharp/></span> Insights</div>
                <div className='side_offer'> <span><IoPlaySharp/></span> Articles & News</div>
            </div>
            <hr />
            <div className='side_offering_div2'>
                <div className='side_offer'> <pre>  </pre> About Us</div>
                <div className='side_offer'> <span><IoPlaySharp/></span> Get Help</div>
                <div className='side_offer'> <pre>  </pre> Download App</div>
            </div>
            <hr />

        </div>

        <div className='sidebar_footer'>
            <form>
                <input type="text" placeholder='Search by Property Code' value={searchTerm} onChange={handleSearchChange} />
                <span><IoSearchOutline /> </span>
            </form>

            <p>Toll Free Number: 1800 41 99099. <br />
            For international numbers <span>click here</span></p>

        </div>

    </div>

    </section>
  )
}

export default Sidebar