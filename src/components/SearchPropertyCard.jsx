"use client"
import React, {useState} from 'react'
import '../styles/searchPropertyCard.scss'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";

//icons
import { FaCheck } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { PiShareFatLight } from "react-icons/pi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaAngleDown } from "react-icons/fa6";

function SearchPropertyCard({PropertyData}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const formatIndianPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return '₹ 0';
    }

    // --- Conversion Factors ---
    const THOUSAND = 1000;
    const LAKH = 100000;
    const CR = 10000000;

    let formattedPrice;

    if (price >= CR) {
        const value = price / CR;
        formattedPrice = `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
    } else if (price >= LAKH) {
        const value = price / LAKH;
        formattedPrice = `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakh`;
    } else if (price >= THOUSAND) {
        const value = price / THOUSAND;
        formattedPrice = `${value.toLocaleString('en-IN', { maximumFractionDigits: 1 })} K`;
    } else {
        return `₹ ${price.toLocaleString('en-IN')}`;
    }
    return `₹ ${formattedPrice}`;
}; 

    const pricepersqft = (price, area) => {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return '₹ 0';
    }

    let formattedPrice1;
    const value = price / area;
    formattedPrice1 = `${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    if(value >= 100000){
        console.log('running')
        let formattedPrice2
        formattedPrice2 = formatIndianPrice(value)
        return ` ${formattedPrice2} per sqft`;
    }


    return `₹ ${formattedPrice1} per sqft`;
}; 

    // Define all possible details and how to format them
    const UNIVERSAL_DETAIL_CONFIG = [
        { key: "superBuiltUpArea", label: "SUPER BUILT UP", unit: "sqft" },
        { key: "carpetArea", label: "CARPET AREA", unit: "sqft" },
        { key: "plotSize", label: "PLOT SIZE", unit: "sqft" },
        { key: "landAreaUnitDisplay", label: "LAND AREA", landArea: true },
        
        { key: "status", label: "STATUS", dynamicLabel: true },

        { key: "clearHeight", label: "CLEAR HEIGHT", unit: "m" },
        { key: "columnSpacing", label: "COLUMN SPACING", unit: "m" },

        { key: "constructionType", label: "CONSTRUCTION TYPE" },
        { key: "permission", label: "PERMISSION" },

        
        { key: "facing", label: "FACING" },
        { key: "furniture", label: "FURNISHING" },
        { key: "totalBedrooms", label: "BEDROOMS" },
        { key: "bathroom", label: "BATHROOMS" },
        { key: "balcony", label: "BALCONY" },
        { key: "carParking", label: "CAR PARKING" },
        
        { key: "waterSource", label: "WATER SUPPLY", excludeValue: "Not Available" },
        { key: "propertyFloor", label: "FLOOR" },
        { key: "totalFloors", label: "TOTAL FLOORS" },
        
        // For shops
        { key: "shopLocationType", label: "LOCATION TYPE" },
        
        // Status logic
        { key: "transactionType", label: "TRANSACTION" },
        { key: "propertySurrounding", label: "SURROUNDING", excludeValue: "One Side Open" },
    ];
    const getFilteredExtraDetails = (data) => {
  const details = [];

  for (const config of UNIVERSAL_DETAIL_CONFIG) {
    const rawValue = data[config.key];

    // Skip empty
    if (
      rawValue === undefined ||
      rawValue === null ||
      rawValue === "" ||
      rawValue === 0
    ) continue;

    // Skip excluded
    if (config.excludeValue && rawValue === config.excludeValue) continue;

    // ---------- LAND AREA SPECIAL HANDLING ----------
    if (config.landArea) {
      const unit = data.landAreaUnitDisplay; // "SQFT" | "Acre" | "Bigha"

      if (!unit) continue; // No unit selected → skip

      const areaValue = data[unit]; // dynamic field (SQFT, Acre, Bigha)

      if (!areaValue) continue;

      details.push({
        label: config.label,
        value: `${areaValue} ${unit}`,
      });

      if (details.length === 7) break;
      continue;
    }

    // ---------- NORMAL FIELDS ----------
    let label = config.label;
    let value = rawValue;

    // STATUS special logic
    if (config.dynamicLabel && config.key === "status") {
      if (rawValue !== "Ready to Move") {
        label = rawValue;
        value = data.completionTime
          ? new Date(data.completionTime).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })
          : "—";
      }
    }

    // Apply unit
    if (config.unit) value = `${value} ${config.unit}`;

    details.push({ label, value });

    if (details.length === 7) break;
  }

  return details;
};
    const extraDetails = getFilteredExtraDetails(PropertyData);

    const Router = useRouter()
    const GetDetailForMobile = (id) => {
        Router.push(`/property/${id}`)
    }

    

  return (
    <>

    
    <div className="search_prop_card_main_container">


        <div className='image_container' onClick={() => GetDetailForMobile(`${PropertyData._id}`)}>
        <Image src={PropertyData.propertyImage[0]} alt="image" fill
            sizes="(max-width: 600px) 100vw, 300px" />
        </div>

        <div className='property_info_container'>

            <div className='tag_and_support'>
                <div className='zero_brokrage_tag'><FaCheck className='tag_icon' />ZERO BROKERAGE</div>
                <div className='support_icons'> <CiHeart/> <PiShareFatLight/></div>
            </div>

            <h3 className='responsiv_price'>{formatIndianPrice(PropertyData.price)}</h3>
            <div className='prop_heading' onClick={() => GetDetailForMobile(`${PropertyData._id}`)}>
                <h2>{PropertyData.propertyCategory == 'House/Flat'? PropertyData.totalBedrooms+'BHK' : ''} {PropertyData.propertyType? PropertyData.propertyType : PropertyData.propertyCategory} for Sale in {PropertyData.location}</h2>
                <h5>{PropertyData.buildingOrColonyName}</h5>
            </div>

            {extraDetails.length > 0 && (
                    <div className="prop_details" onClick={() => GetDetailForMobile(`${PropertyData._id}`)}>
                    {extraDetails.map((item, index) => {
                        const isFirstInColumn = index % 3 === 0;
                        const className = `prop_details_item ${isFirstInColumn ? '' : 'leftborder'}`;
                        
                        return (
                        <div key={index} className={className}>
                            <p>{item.label}</p> 
                            <h6>{item.value}</h6>
                        </div>
                        );
                    })}
                    </div>
                    )}
            

            <div className='prop_description' onClick={() => GetDetailForMobile(`${PropertyData._id}`)}>
                {PropertyData.description.length <= 150? PropertyData.description :<>
                {isExpanded? PropertyData.description : PropertyData.description.slice(0,150) + '...'}
                <button onClick={toggleExpand}>{isExpanded? 'Read less' : <FaAngleDown />}</button>
                </>} 
            </div>
        
        </div>


        <div className='action_buttons_container'>
            <div className='prop_price'> <h3>{formatIndianPrice(PropertyData.price)}</h3> <p>{pricepersqft(PropertyData.price, PropertyData.superBuiltUpArea? PropertyData.superBuiltUpArea : PropertyData.plotSize)}</p></div>

            <div className='action_buttons'>
                <div className="callback_button">Contact Us</div>
                <Link href={`/property/${PropertyData._id}`}>
                <div className="getinfo_button">Get Info</div>
                </Link>
            </div>
            <div className='prop_builder'>
                <p>Get Home Loan</p>
                {/* <h6>Builder: {PropertyData.developerName}</h6>
                <p>Operating Since: 2013</p> */}
            </div>
        </div>
    </div>


    </>
  )
}

export default SearchPropertyCard