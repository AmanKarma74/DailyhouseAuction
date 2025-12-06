// src/app/search/page.jsx
import Mainnavbar from "@/components/Mainnavbar";
import FilterSearch from "@/components/FilterSearch";
import SearchPropertyCard from "@/components/SearchPropertyCard";
import AdOnSearchPage from "@/components/AdOnSearchPage";
import PropertyCard from "@/components/PropertyCard";
import Image from "next/image";
import propertyGuideBanner from "../../../public/assets/Property_Guide_Banner.png";

import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property";
import "./search.scss";

// -------------------------------------------
// Serialize Mongo Document → Plain Object
// -------------------------------------------
function serializeProperty(p) {
  return {
    ...p,
    _id: p._id.toString(),
    listedBy: p.listedBy?.toString() || "",
    completionTime: p.completionTime?.toString() || "",
    createdAt: p.createdAt?.toString() || "",
    updatedAt: p.updatedAt?.toString() || "",
  };
}

// -------------------------------------------
// Category → Property Types Map
// -------------------------------------------
const CATEGORY_TYPE_MAP = {
  Residential: ["House", "Flat", "Villa", "Farmhouse", "Residential Plot"],
  Commercial: [
    "Office Space",
    "Shop",
    "Warehouse",
    "Commercial Plot",
    "Godown",
    "Showroom",
  ],
  "New Projects": [
    "House",
    "Flat",
    "Villa",
    "Farmhouse",
    "Shop",
    "Warehouse",
    "Godown",
    "Showroom",
    "Office Space",
  ],
  Land: [
    "Residential Land",
    "Commercial Land",
    "Agricultural Land",
    "Industrial Land",
  ],
};

// -------------------------------------------
// Build MongoDB Query Based on URL Params
// -------------------------------------------
function buildQuery(params) {
  const query = {};

  const {
    category,
    type,
    bhk,
    maxPrice,
    locations,
  } = params;

  // 1️⃣ CATEGORY fallback → show all property types under category
  if (category && CATEGORY_TYPE_MAP[category]) {
    query.propertyType = { $in: CATEGORY_TYPE_MAP[category] };
  }

  // 2️⃣ If user selected property types → override category fallback
  if (type) {
    const arr = type.split(",");
    query.propertyType = { $in: arr };
  }

  // 3️⃣ BHK Filter
  if (bhk) {
    const arr = bhk.split(",").map((n) => parseInt(n));
    query.totalBedrooms = { $in: arr };
  }

  // 4️⃣ Maximum Price
  if (maxPrice) {
    query.price = { $lte: parseInt(maxPrice) };
  }

  // 5️⃣ Locations Filter
  if (locations) {
    const arr = locations.split(",");
    query.location = { $in: arr };
  }

  return query;
}

// -------------------------------------------
// SERVER COMPONENT
// -------------------------------------------
export default async function SearchPage({ searchParams }) {
  const params = await searchParams || {};

  await dbConnect();

  const query = buildQuery(params);

  // Fetch properties — sorted high price → low price
  const docs = await Property.find(query)
    .sort({ price: -1 })
    .lean();

  const properties = docs.map((p) => serializeProperty(p));

  return (
    <>
      <div className="mainnavbar_container_wrapper_home">
        <Mainnavbar
          featureColor="#000000"
          postBgColor="#FFC72C"
          logoColor="#2ca0ff"
        />
      </div>

      {/* FILTER BAR */}
      <div className="filterSearch_component">
        <FilterSearch />
      </div>

      {/* MAIN RESULT SECTION */}
      <div className="resultPageContainer">
        {/* LEFT: PROPERTY LIST */}
        <div className="searchedProperties_container">
          <h2 className="searchedProperties_container_heading">
            {properties.length} Results | Properties in Indore
          </h2>

          {properties.length === 0 ? (
            <p>No properties found.</p>
          ) : (
            properties.map((p) => (
              <SearchPropertyCard key={p._id} PropertyData={p} />
            ))
          )}
        </div>

        {/* RIGHT: ADS + SUGGESTED PROPERTIES */}
        <div className="sideSection_container">
          <div className="sideSection_container_adonsearchpage_container only_desktop">
            <AdOnSearchPage />
          </div>

          <div className="sideSection_container_prop_card_container">
            <div className="sideSection_container_prop_card_container_slider">
              {properties.slice(-4).map((p) => (
                <div className="search_page_card_holder" key={p._id}>
                  <PropertyCard data={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE AD SECTION */}
      <section className="appoint_advisor_section only_mobile">
        <div className="advisor_div">
          <Image src={propertyGuideBanner} alt="Get Your Guide Now" />
        </div>
      </section>
    </>
  );
}
