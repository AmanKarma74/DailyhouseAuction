// src/components/Mainnavbar.jsx
"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";

import navbarStyle from '../styles/Mainnavbar.module.scss'
import Link from 'next/link';

import Sidebar from './Sidebar';
import DropdownCard from './Dropdown';

//Images
import Billu from "../../public/assets/Billu.jpg"
import Elon from "../../public/assets/Elon.png"
import Broker from "../../public/assets/Broker.png"
import Dealer from "../../public/assets/men_img.jpg"

//Icons
import { BiSupport } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";

function Mainnavbar({featureColor, postBgColor, logoColor}) {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [currentUrl, setCurrentUrl] = useState("/");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.pathname + window.location.search);
    }
  }, []);

    const [showDropdown, setShowDropdown] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset'; 
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSidebar]);
    
    
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    const openDropdown = (dataName, data) => {
      setCurrentFocus(dataName);
        setDataName(data);
        setShowDropdown(true);

    };
    const closeDropdown = () => {
        setCurrentFocus('');
        setShowDropdown(false);
    };

    const buyerCardData = [
        {
          headings: ["BUY A HOME","Land/Plot", "COMMERCIAL", "POPULAR AREAS", "INSIGHTS", "ARTICLES & NEWS"],
          content: [
            {
              title: "Properties in Indore",
              links: [
                "Flats",
                "Builder Floors",
                "Independent House",
                "Plots in Indore",
                "Studio Apartments/1 RK Flats",
                "Farm Houses"
              ]
            },
            {
              title: "Popular Searches",
              links: [
                "Property in Indore",
                "Verified Property in Indore",
                "New Projects in Indore"
              ]
            },
          ],
          img: Billu,
        }
      ];
    const tenantCardData = [
        {
          headings: ["RENT A HOME","PG/CO-LIVING", "COMMERCIAL", "POPULAR AREAS", "INSIGHTS", "ARTICLES & NEWS"],
          content: [
            {
              title: "Properties in Indore",
              links: [
                "Flats",
                "Builder Floors",
                "Independent House",
                "Plots in Indore",
                "Studio Apartments/1 RK Flats",
                "Farm Houses"
              ]
            },
            {
              title: "Popular Searches",
              links: [
                "Property for rent in Indore",
                "Verified Property in Indore"
              ]
            },
          ],
          img: Elon,
        }
      ];
    const ownerCardData = [
        {
          headings: ["OWNER OFFERINGS", "INSIGHTS", "ARTICLES & NEWS"],
          content: [
            {
              title: "OWNER OFFERINGS",
              links: [
                "Post Property for Free",
                "Owner Services",
                "Profile",
                "View Responses"
              ]
            },
          ],
          img: Broker,
        }
      ];
    const builderCardData = [
        {
          headings: ["DEALER OFFERINGS", "RESEARCH AND ADVICE"],
          content: [
            {
              title: "PROPERTY SERVICES",
              links: [
                "Post Property for Free",
                "Dealer Services",
                "Profile",
                "View Responses"
              ]
            },
          ],
          img: Dealer,
        }
      ];
    const insightCardData = [
        {
          headings: ["LOCALITY INSIGHTS", "PRICE TRENDS", "TRANSACTION PRICES", "REVIEWS"],
          content: [
            {
              title: "Most Popular Localities",
              links: [
                "Silicon City Overview",
                "Vijay Nagar Overview",
                "Super Corridor Overview",
                "AB Bypass Road Overview",
                "Lig Overview",
                "Ujjain Road Overview"
              ]
            },
          ],
          img: Dealer,
        }
      ];
    const [dataName, setDataName] = useState(buyerCardData);  
    const [currentFocus, setCurrentFocus] = useState('');

  return (

    <>
    <div className={showDropdown? `${navbarStyle.background_blur} ${navbarStyle.show_blur}` : (showSidebar? `${navbarStyle.background_blur} ${navbarStyle.show_blur} ${navbarStyle.sidebar_blur}` : `${navbarStyle.background_blur}`)}></div>
    <Sidebar className={navbarStyle.sidebar_component} isOpen={showSidebar} onClose={toggleSidebar}  />
    
    <section className={navbarStyle.main_navbar_container}>

    <nav className={navbarStyle.navbar}>
        <Link href='/'>
        <div className={navbarStyle.navleft}>Logo</div>
        </Link>

        <div className={navbarStyle.navright}>

            <div className={navbarStyle.navfeatures} style={{color: featureColor}}>
            <a onMouseEnter={() => openDropdown('buyerCardData',buyerCardData)} style={currentFocus == 'buyerCardData' ? { zIndex: 1500, color: 'white' } : {}}>For Buyers</a>
            {/* <a onMouseEnter={() => openDropdown('tenantCardData',tenantCardData)} style={currentFocus == 'tenantCardData' ? { zIndex: 1500, color: 'white' } : {}}>For Tenants</a> */}
            <a onMouseEnter={() => openDropdown('ownerCardData',ownerCardData)} style={currentFocus == 'ownerCardData' ? { zIndex: 1500, color: 'white' } : {}}>For Owners</a>
            <a onMouseEnter={() => openDropdown('builderCardData',builderCardData)} style={currentFocus == 'builderCardData' ? { zIndex: 1500, color: 'white' } : {}}>For Dealers / Builders</a>
            <a onMouseEnter={() => openDropdown('insightCardData',insightCardData)} style={currentFocus == 'insightCardData' ? { zIndex: 1500, color: 'white' } : {}}>Insights</a>
            </div>

            {isLoggedIn ? 
            (
            <div onMouseEnter={closeDropdown} className={navbarStyle.navbar_post} style={{backgroundColor: postBgColor}}>
              <Link href="/post-property" className={navbarStyle.navbar_post_link}>
              Post property <span className={navbarStyle.navbar_post_span}>FREE</span>
              </Link>
            </div>
            ) : 
            (
            <div onMouseEnter={closeDropdown} className={navbarStyle.navbar_post} style={{backgroundColor: postBgColor, justifyContent: 'center'}}>
              <Link href={`/auth?redirect_to=${encodeURIComponent(currentUrl)}`} className={navbarStyle.navbar_post_link}>
              Login / SignUp
              </Link>
            </div>
            )}


            <div className={`${navbarStyle.icon} ${navbarStyle.desktop_icon}`}><span style={{color: featureColor}}><BiSupport/></span></div>
            <div className={`${navbarStyle.icon} ${navbarStyle.desktop_icon}`}>
              <Link href={
                  isLoggedIn
                    ? "/profile"
                    : `/auth?redirect_to=${encodeURIComponent(currentUrl)}`
                }>
              <span style={{color: featureColor}}><FaUserCircle/></span>
              </Link>
            </div>
            <div className={` ${navbarStyle.mobile_menu_icon} ${navbarStyle.icon2}`}><span style={{color: featureColor}}><HiOutlineBars3CenterLeft onClick={toggleSidebar}/></span></div>
        </div>
    </nav>

    <div className={navbarStyle.navdropdown_slides}>
    <DropdownCard Data={dataName} isOpen={showDropdown} onClose={closeDropdown} />
    </div>

    </section>
    </>

  )
}

export default Mainnavbar
