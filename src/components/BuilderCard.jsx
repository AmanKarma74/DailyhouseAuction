import React from 'react'
import Image from 'next/image';
import '../styles/builderCard.scss'


//ICONS
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

function BuilderCard({data}) {
  return (
    <div className="builder_card_container">
        <div className="profile_showcase_main">
            <div className="image_div">
                <Image src={data.Profile_pic} alt="img" className='person_img'/>
                <Image src={data.logo} alt="company" className='builder_company_logo' />
            </div>
            <div className="profile_details">
                <div className='personal_details'>
                    <h2>{data.Name}</h2>
                    <h4>RERA ID: {data.RERA_ID}</h4>
                </div>
                <div className='company_details'>
                    <h2>{data.Company_name}</h2>
                    <h3>Operating Since {data.Operating_since}</h3>
                </div>
            </div>
        </div>

        <div className="about_agent">
            <h4>About Agent</h4>
            <ul>
                <li><span><IoIosCheckmarkCircleOutline/></span> Has maximum property options </li>
                <li><span><IoIosCheckmarkCircleOutline/></span> Is the top agent of the locality </li>
                <li><span><IoIosCheckmarkCircleOutline/></span> Is trusted by all users </li>
            </ul>
        </div>

        <div className="view_profile">
            View Profile
        </div>
    </div>
  )
}

export default BuilderCard