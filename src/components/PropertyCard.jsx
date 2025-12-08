import React from "react";
import Image from "next/image";
import "../styles/propertyCard.scss";
import Link from "next/link";

import { RiImageLine } from "react-icons/ri";

// Fallback image if backend has no images
const fallbackImage = "/assets/men_img.jpg";

function PropertyCard({ data }) {
  const images = data.propertyImage || []; // API uses propertyImage
  const firstImage = images[0] || fallbackImage;

  const formatIndianPrice = (price) => {
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return "₹ 0";
    }

    const THOUSAND = 1000;
    const LAKH = 100000;
    const CR = 10000000;

    if (price >= CR) return `₹ ${(price / CR).toFixed(2)} Cr`;
    if (price >= LAKH) return `₹ ${(price / LAKH).toFixed(2)} Lakh`;
    if (price >= THOUSAND) return `₹ ${(price / THOUSAND).toFixed(1)} K`;

    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="main_container">
      <div className="upperdiv">
        {/* Responsive Image WITHOUT width/height */}
        <div className="image_wrapper">
          <Image
            src={firstImage}
            alt="property"
            fill
            sizes="(max-width: 600px) 100vw, 300px"
            className="property_image"
          />
        </div>

        <span>
          <RiImageLine className="pic_icon" /> {images.length}
        </span>
      </div>

      <div className="lowerdiv">
        <h5>
          {data.propertyCategory === "House/Flat"
            ? data.totalBedrooms + " BHK "
            : ""}
          {data.propertyType || data.propertyCategory}
        </h5>

        <div className="price">
          <span className="price_span">{formatIndianPrice(data.price)}</span>
          <span>{data.superBuiltUpArea} sqft</span>
        </div>

        <p className="card_prop_location">{data.location}</p>
        <p className="card_prop_stage">{data.status}</p>

        <Link href={`/property/${data._id}`}><button className="button">View Details</button></Link>
      </div>
    </div>
  );
}

export default PropertyCard;
