// src/app/property/[propertyid]/page.jsx
import { React } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

import "./property.scss";
import Mainnavbar from "@/components/Mainnavbar";
import ImageModalOpener from "@/components/ImageModelOpener";
import PropertyCardExtraDetails from "@/components/PropertyCardExtraDetails";

import { AmenityIconMap } from "@/data/AmenityIconMap";
import { BasicDetailsIconMap } from "@/data/AmenityIconMap";

async function Property({ params }) {
  
  const session = await getServerSession(authOptions);
  const propertyid = (await params).propertyid;
  
  if (!session) {
    return redirect(`/auth?redirect_to=/property/${propertyid}`);
  }
  let PropertyData = null;

  // ============================
  // FETCH PROPERTY FROM DB
  // ============================
  try {
    console.log("property fectching starts")
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/properties/${propertyid}`,
      { method: "GET", cache: "no-store" }
      
    );

    const data = await res.json();
    if (data.success) {
      PropertyData = data.property;

      // ---------------------------------------
      // 🔥 NORMALIZE ALL FIELDS FOR UI
      // ---------------------------------------

      // 1️⃣ Normalize Images
      if (PropertyData.propertyImage) {
        PropertyData.img = PropertyData.propertyImage.map((url, i) => ({
          url,
          name: `image-${i}.jpg`,
        }));
      } else {
        PropertyData.img = [];
      }

      // 2️⃣ Normalize near_by
      PropertyData.near_by = PropertyData.nearByPlaces || [];

      // 3️⃣ waterSource → waterSupply
      PropertyData.waterSupply = PropertyData.waterSource;

      // 4️⃣ furniture → furnished
      PropertyData.furnished = PropertyData.furniture;

      // 5️⃣ Fix lengthOfPlot spelling across the UI logic
      PropertyData.lenghtOfPlot = PropertyData.lengthOfPlot;

      // 6️⃣ Convert Acre/Bigha/SQFT → landSizeInSQFT
      if (PropertyData.landAreaUnitDisplay === "Acre") {
        PropertyData.landSizeInSQFT = (PropertyData.Acre || 0) * 43560;
      } else if (PropertyData.landAreaUnitDisplay === "Bigha") {
        PropertyData.landSizeInSQFT = (PropertyData.Bigha || 0) * 17424;
      } else {
        PropertyData.landSizeInSQFT = PropertyData.SQFT || PropertyData.plotSize;
      }

      // 7️⃣ Create display category/type
      PropertyData.propertyCategoryDisplay =
        PropertyData.propertyType || PropertyData.propertyCategory;

      // 8️⃣ Format completionTime
      if (PropertyData.completionTime) {
        PropertyData.completionTime = new Date(
          PropertyData.completionTime
        ).toLocaleDateString("en-IN");
      }
      console.log("property fectching compelets, data: ", PropertyData)
    }
  } catch (err) {
    console.error("Error fetching property:", err);
  }

  // Fallback UI if no property found
  if (!PropertyData) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Property not found</h2>
        <p>Please check the URL.</p>
      </div>
    );
  }

  // ========================================================
  //  UTILITIES (NO CHANGE)
  // ========================================================
  const formatIndianPrice = (price) => {
    if (typeof price !== "number" || isNaN(price) || price < 0) return "₹ 0";

    const THOUSAND = 1000;
    const LAKH = 100000;
    const CR = 10000000;

    if (price >= CR) return `₹ ${(price / CR).toFixed(2)} Cr`;
    if (price >= LAKH) return `₹ ${(price / LAKH).toFixed(2)} Lakh`;
    if (price >= THOUSAND) return `₹ ${(price / THOUSAND).toFixed(1)} K`;
    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  const pricepersqft = (price, area) => {
    if (!price || !area) return "₹ 0";
    const value = price / area;

    if (value >= 100000) {
      return `${formatIndianPrice(value)} per sqft`;
    }

    return `₹ ${value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })} per sqft`;
  };

  // ========================================================
  // BASIC / EXTRA DETAIL LOGIC (NO CHANGE)
  // ========================================================
  const landAmenityChecks = [
    { name: "Boundary Wall/Fencing", label: "Boundary Wall", mapKey: "FaVectorSquare" },
    { name: "Street Lights", label: "Street Lights", mapKey: "FaStreetView" },
    { name: "High Foot Traffic Area", label: "High Traffic", mapKey: "FaWalking" },
    { name: "Clear Title/Approved for Commercial Use", label: "Commercial Approved", mapKey: "FaFileContract" },
    { name: "High Power Load Provision", label: "High Power Load", mapKey: "FaIndustry" },
    { name: "Clear Title/Approved for Industrial Use", label: "Industrial Approved", mapKey: "FaFileContract" },
    { name: "High Tension Power Line Access", label: "HT Power Access", mapKey: "FaBolt" },
    { name: "Labour Colony/Housing nearby", label: "Near Labour Housing", mapKey: "FaUsers" },
    { name: "Fertile Soil", label: "Fertile Soil", mapKey: "FaMountain" },
    { name: "Water Source (Borewell/Canal)", label: "Water Source", mapKey: "FaWater" },
    { name: "Fencing Available", label: "Fencing Available", mapKey: "FaVectorSquare" },
    { name: "Farm House Permission", label: "Farm House Permit", mapKey: "FaHome" },
    { name: "Vaastu Compliant", label: "Vastu Compliant", mapKey: "vastu" },
  ];

  const getBasicCardDetails = (data) => {
    const finalDetails = [];
    const amenityNames = data.amenities?.map((a) => a.name) || [];
    const amenitySet = new Set(amenityNames);
    const hasAmenity = (x) => amenitySet.has(x);
    const hasNotOneSideOpen = data.propertySurrounding !== "One Side Open";

    const priorityList = [
      { key: "totalBedrooms", label: `${data.totalBedrooms} Beds`, mapKey: "bedroom" },
      { key: "bathroom", label: `${data.bathroom} Baths`, mapKey: "bathroom" },
      {
        key: "propertySurrounding",
        label: data.propertySurrounding,
        condition: hasNotOneSideOpen,
        mapKey: "surrounding",
      },
      { key: "furniture", label: data.furniture, mapKey: "furniture" },
      {
        key: "dimension",
        label: `${data.widthOfPlot} * ${data.lengthOfPlot} ft`,
        condition: data.widthOfPlot && data.lengthOfPlot,
        mapKey: "dimension",
      },
    ];

    for (const detail of priorityList) {
      const condition =
        detail.condition !== undefined ? detail.condition : data[detail.key];
      if (condition && finalDetails.length < 3) {
        finalDetails.push({
          icon: BasicDetailsIconMap[detail.mapKey],
          value: detail.label,
        });
      }
    }

    for (const check of landAmenityChecks) {
      if (finalDetails.length >= 3) break;
      if (hasAmenity(check.name)) {
        finalDetails.push({
          icon: BasicDetailsIconMap[check.mapKey],
          value: check.label,
        });
      }
    }

    if (data.near_by?.length > 0) {
      const nearby = data.near_by.slice(0, 3 - finalDetails.length);
      nearby.forEach((x) =>
        finalDetails.push({
          icon: BasicDetailsIconMap.nearby,
          value: `Near ${x.name}`,
        })
      );
    }

    return finalDetails;
  };

  const basicDetailsForCard = getBasicCardDetails(PropertyData).slice(0, 3);

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

        { key: "waterSource", label: "WATER SUPPLY", excludeValue: "Not Available" },
        { key: "propertySurrounding", label: "SURROUNDING", excludeValue: "One Side Open" },

        { key: "facing", label: "FACING" },
        { key: "furniture", label: "FURNISHING" },
        { key: "totalBedrooms", label: "BEDROOMS" },
        { key: "bathroom", label: "BATHROOMS" },
        { key: "balcony", label: "BALCONY" },
        { key: "carParking", label: "CAR PARKING" },

        { key: "propertyFloor", label: "FLOOR" },
        { key: "totalFloors", label: "TOTAL FLOORS" },

        // For shops
        { key: "shopLocationType", label: "LOCATION TYPE" },

        // Status logic
        { key: "transactionType", label: "TRANSACTION" },
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

  const getDisplayValue = (data, key) => {
    switch (key) {
      case "plotSize":
        return data.plotSize ? `${data.plotSize} sqft` : null;

      case "landSize":
        if (data.propertyCategory === "Land") {
          return (
            data.landSizeInSQFT &&
            `${data.landSizeInSQFT} ${data.landAreaUnitDisplay}`
          );
        }
        return null;

      case "propertyTypeDisplay":
        return data.propertyCategoryDisplay;

      case "pricePerSqft":
        const size =
          data.superBuiltUpArea ||
          data.carpetArea ||
          data.landSizeInSQFT ||
          data.plotSize;
        return size ? pricepersqft(data.price, size) : null;

      case "statusDisplay":
        return data.status === "Ready to Move"
          ? data.status
          : data.completionTime;

      case "dimensions":
        return data.widthOfPlot && data.lenghtOfPlot
          ? `${data.widthOfPlot} x ${data.lenghtOfPlot} ft`
          : null;

      case "address":
        return data.location;

      default:
        return data[key];
    }
  };

  const basicDetailsMap = [
    { key: "propertyTypeDisplay", label: "Property Type" },
    { key: "price", label: "Price", formatter: formatIndianPrice },
    { key: "plotSize", label: "Plot Size" },
    { key: "landSize", label: "Land Size" },
    { key: "carpetArea", label: "Carpet Area", suffix: " sqft" },
    { key: "pricePerSqft", label: "Price Per sqft" },
    { key: "address", label: "Address" },
    { key: "furnished", label: "Furnishing" },
    { key: "facing", label: "Facing" },
    { key: "propertySurrounding", label: "Surrounding" },
    { key: "statusDisplay", label: "Status" },
    { key: "ReraId", label: "RERA ID" },
  ];

  const extraDetailsMap = [
    { key: "flatFloor", label: "Property Floor" },
    { key: "totalFloors", label: "Total Floors" },
    { key: "dimensions", label: "Dimensions" },
    { key: "transactionType", label: "Transaction Type" },
    { key: "constructionYear", label: "Construction Year" },
    { key: "constructionType", label: "Construction Type" },
    { key: "constructionArea", label: "Construction Area", suffix: " sqft" },
    { key: "permission", label: "Permission" },
    { key: "bathroom", label: "Total Bathroom" },
    { key: "balcony", label: "Total Balcony" },
    { key: "carParking", label: "Car Parking" },
  ];

  const processedExtraDetails = extraDetailsMap
    .map((item) => {
      const rawValue = getDisplayValue(PropertyData, item.key);
      if (!rawValue) return null;
      return {
        label: item.label,
        value: rawValue,
        suffix: item.suffix || "",
        key: item.key,
      };
    })
    .filter(Boolean);

  // ========================================================
  //  UI (UNCHANGED)
  // ========================================================
  return (
    <>
      <div className="mainnavbar_container_property">
        <Mainnavbar featureColor="#303030" postBgColor="#FFC72C" />
      </div>

      <div className="property_details_page_container">
        <div className="property_detail_card1">
          <h3>{formatIndianPrice(PropertyData.price)}</h3>
          <h5>
            {PropertyData.totalBedrooms
              ? PropertyData.totalBedrooms + " BHK"
              : ""}{" "}
            {PropertyData.propertyCategoryDisplay} for Sale in{" "}
            {PropertyData.location}
          </h5>

          <div className="property_detail_card1_middle">
            <ImageModalOpener PropertyData={PropertyData} />

            <div className="property_detail_card1_middle_right">
              {basicDetailsForCard.length > 0 && (
                <div className="basic_details">
                  {basicDetailsForCard.map((item, index) => (
                    <div key={index} className="basic_details_item">
                      <item.icon className="basic_details_icon" />{" "}
                      {" " + item.value}
                    </div>
                  ))}
                </div>
              )}

              {extraDetails.length > 0 && (
                <div className="extra_details">
                  {extraDetails.map((item, index) => {
                    const isFirstInColumn = index % 3 === 0;
                    const className = `extra_details_item ${
                      isFirstInColumn ? "" : "leftborder"
                    }`;

                    return (
                      <div key={index} className={className}>
                        <p>{item.label}</p>
                        <h6>{item.value}</h6>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="property_detail_card1_bottom">
            <div className="share_property_button">Share Property</div>
            <div className="contact_owner_button">Contact Us</div>
          </div>
        </div>

        <div className="property_more_details_card">
          <h3>More Details</h3>

          <div className="details_div">
            {basicDetailsMap.map((item) => {
              const value = getDisplayValue(PropertyData, item.key);
              if (!value) return null;

              const displayValue = item.formatter
                ? item.formatter(value)
                : value;

              return (
                <div key={item.key} className="details_wrapper">
                  <h5 className="details_wrapper_h5">{item.label}</h5>
                  <h4 className="details_wrapper_h4">
                    {displayValue}
                    {item.suffix || ""}
                  </h4>
                </div>
              );
            })}

            <PropertyCardExtraDetails
              PropertyData={PropertyData}
              extraDetailsMap={extraDetailsMap}
              processedExtraDetails={processedExtraDetails}
            />
          </div>
        </div>

        <div className="property_amenities_card">
          <h3>Amenities</h3>
          <div className="amenities_div gap_bottom">
            {PropertyData.amenities?.map((data, index) => {
              const IconComponent = AmenityIconMap[data.icon];
              const DefaultIcon = AmenityIconMap["DefaultIcon"];

              return (
                <div className="amenities_wrapper_div" key={index}>
                  {IconComponent ? (
                    <IconComponent className="amenities_icons" />
                  ) : (
                    <DefaultIcon className="amenities_icons" />
                  )}
                  <p className="amenities_name">{data.name}</p>
                </div>
              );
            })}
          </div>

          <h3>Near By</h3>
          <div className="amenities_div">
            {PropertyData.near_by?.map((data, index) => {
              const IconComponent = AmenityIconMap[data.icon];
              const DefaultIcon = AmenityIconMap["DefaultIcon"];

              return (
                <div className="amenities_wrapper_div" key={index}>
                  {IconComponent ? (
                    <IconComponent className="amenities_icons" />
                  ) : (
                    <DefaultIcon className="amenities_icons" />
                  )}
                  <p className="amenities_name">{data.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Property;
