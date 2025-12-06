import React from 'react';
// import '../styles/dropdown.scss'
import dropdownStyle from '../styles/Dropdown.module.scss'
import Image from 'next/image';

function DropdownCard({Data, isOpen, onClose}) {

  const cardData = Data[0];


  return ( 
    <div className={`${dropdownStyle.slide_dropdown_container} ${isOpen ? `${dropdownStyle.open}` : ''}`} >
        <div onMouseEnter={onClose} className={dropdownStyle.justdiv}></div>
        {
        <div className={dropdownStyle.slide_dropdown} onMouseLeave={onClose}>

            <div className={dropdownStyle.drop_left}>

                <div className={dropdownStyle.drop_left_headings}>
                    <ul>
                        {cardData.headings.map((heading, index) => {
                            return <li key={index}>{heading}</li>
                        }) }                        
                    </ul>
                </div>

                <div className={dropdownStyle.drop_left_footer}>
                    <p>contact us toll free on</p>
                    <pre>1800 41 99099 <span>(9AM-11PM IST)</span></pre>          
                </div>

            </div>

            <div className={dropdownStyle.drop_right}>

                <div className={dropdownStyle.drop_right_content}>

                    <div className={dropdownStyle.drop_right_content_links}>

                    {cardData.content.map((section, index) => (
                        <div key={index} className={dropdownStyle.drop_right_content_links_wrapper}>
                        <p>{section.title}</p>
                        <ul>
                            {section.links.map((link, linkIndex) => (
                            <li key={linkIndex}>{link}</li> 
                            ))}
                        </ul>
                        </div>
                        ))}

                    </div>

                    <div className={dropdownStyle.drop_right_content_visual}>
                        <Image src={cardData.img} alt="" className={dropdownStyle.drop_right_content_visual_img} width={210} height={240}  />
                    </div>
                </div>

                <div className={dropdownStyle.drop_right_footer}>Email us at <pre> services@amankarma.com.</pre> or call us at <pre> 1800 41 99099 </pre> (IND Toll-Free)</div>
            
            </div>

        </div>
        }
        <div onMouseEnter={onClose} className={dropdownStyle.justdiv2}></div>
    </div>
);

}

export default DropdownCard;
