"use client"
import React, { useRef, useState } from 'react'
import '../styles/navbar.scss'
import sampleprofile from '../assets/profile.jpg'

import { CgProfile } from "react-icons/cg";

import Sidebar from './Sidebar';

//icons
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [prop_type, setProp_type] = useState('Buy');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleProptype = (value) => {
    setProp_type(value);
    setShowDropdown(!showDropdown);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle search logic here 
    console.log('Searching for:', searchTerm); 
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  return (
    <>
    <Sidebar isOpen={showSidebar} onClose={toggleSidebar} />
    <nav className="navbar">
      <div className="container">
        
        <div className="navbar-brand">
          <h1>logo</h1>
        </div>

      <div className="navbar_search_container">

        <div className="navbar_form_container">
        <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
          
          <button className='prop_button' onClick={toggleDropdown} > {prop_type} <span > {showDropdown? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}</span> </button>
  
          <input
            type="text"
            placeholder="Enter Locality / Project / Society / Landmark"
            value={searchTerm}
            onChange={handleSearchChange}
          />
  
          <button className='search_icon' type="submit">
            <IoSearchOutline />
          </button>
  
          </form>
        </div>


        {showDropdown && (
        <div className="prop_dropdown">
          <div className="drop_heading">Residential</div>
          <ul>
            <li onClick={() => {handleProptype('Buy')}}>Buy</li>
            <li onClick={() => {handleProptype('Rent')}}>Rent</li>
            <li onClick={() => {handleProptype('PG')}}>PG</li>
            <li onClick={() => {handleProptype('Projects')}}>Projects</li>
          </ul>
          
          <div className="drop_heading">Commercial</div>
          <ul>
            <li onClick={() => {handleProptype('Buy')}}>Buy</li>
            <li onClick={() => {handleProptype('Lease')}}>Lease</li>
            <li onClick={() => {handleProptype('Project')}}>Projects</li>
          </ul>
        </div>
        )}


      </div>


        <div className="navbar-buttons">

          <div className='navbar_post'>Post property <span>FREE</span> </div>
          <div className='navbar-profile'><CgProfile /> </div>
          <div className='navbar_sideline' onClick={toggleSidebar}><HiOutlineBars3CenterLeft /></div>

        </div>

      </div>

      
    </nav>
    </>
  );
}

export default Navbar;
