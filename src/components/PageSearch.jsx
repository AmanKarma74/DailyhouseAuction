"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../styles/pageSearch.scss";
import ProptypeDrop from "./ProptypeDrop";

// Dummy Data
import { INDORE_LOCATIONS } from "@/data/IndoreLocations";

// Icons
import {
  IoLocationSharp,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoSearch,
} from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaHouse } from "react-icons/fa6";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";


// ---------------------------
// CATEGORY MAP
// ---------------------------
const CATEGORY_MAP = {
  Residential: "Residential",
  "New Project": "New Project",
  Commercial: "Commercial",
  Land: "Land",
};
// ---------------------------------------------
// PROPERTY TYPE MASTER LIST (for recognition)
// ---------------------------------------------
const ALL_PROPERTY_TYPES = new Set([
  "House",
  "Flat",
  "Villa",
  "Farmhouse",
  "Residential Plot",
  "Commercial Plot",
  "Shop",
  "Warehouse",
  "Office Space",
  "Godown",
  "Showroom",
  "Residential Land",
  "Commercial Land",
  "Industrial Land",
  "Agricultural Land",
]);

// ---------------------------------------------
// BUDGET STRING → NUMBER PARSER
// ---------------------------------------------
function parseBudgetToNumber(value) {
  if (!value) return null;

  const lower = value.toLowerCase();

  if (lower.includes("cr")) {
    return parseFloat(lower) * 10000000;
  }
  if (lower.includes("lakh")) {
    return parseFloat(lower) * 100000;
  }
  if (lower.includes("k")) {
    return parseFloat(lower) * 1000;
  }
  return parseInt(value.replace(/[^0-9]/g, ""));
}

export default function PageSearch() {
  const router = useRouter();

  
  const [propCategory, setPropCategory] = useState("Residential");

  // ----------------------
  // LOCALITY SEARCH STATE
  // ----------------------
  const [locations, setLocations] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const firstLocation = locations[0];
  const shortenedLocationName =
    firstLocation && firstLocation.length >= 9
      ? firstLocation.substring(0, 6) + ".."
      : firstLocation || "";

  // Add Location
  const handleAddLocation = (newLocation) => {
    if (newLocation && !locations.includes(newLocation)) {
      setLocations([...locations, newLocation]);
      setLocationInput("");
      setSuggestions(filterSuggestions(""));
    }
  };

  // Remove Location
  const handleRemoveLocation = (locationToRemove) => {
    const updated = locations.filter((loc) => loc !== locationToRemove);
    setLocations(updated);

    if (locationInput) {
      setSuggestions(filterSuggestions(locationInput));
    } else {
      setSuggestions(filterSuggestions(""));
    }
    setShowLocationDropdown(true);
  };

  const dropdownRef = useRef(null);

  // Filter suggestions
  const filterSuggestions = (query) => {
    if (!query.trim()) return INDORE_LOCATIONS.slice(0, 8);

    const lower = query.toLowerCase();
    return INDORE_LOCATIONS.filter(
      (item) => item.toLowerCase().includes(lower) && !locations.includes(item)
    ).slice(0, 10);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setLocationInput(query);
    setShowLocationDropdown(true);
    setSuggestions(query ? filterSuggestions(query) : filterSuggestions(""));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".location_div_container")
      ) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


// CLOSE BUDGET DROPDOWN ON OUTSIDE CLICK
const budgetDropRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      budgetDropRef.current &&
      !budgetDropRef.current.contains(event.target) &&
      !event.target.closest('.budget_div')
    ) {
      setShowBudget(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  // ---------------------------
  // PROPERTY TYPE (tags)
  // ---------------------------
  const [propDesc, setPropDesc] = useState([]);
  const [showPropDesc, setShowPropDesc] = useState(false);

  const firstPropertyDesc = propDesc[0];
  const shortenedPropertyDescName =
    firstPropertyDesc && firstPropertyDesc.length > 11
      ? firstPropertyDesc.substring(0, 8) + "..."
      : firstPropertyDesc || "";

  const handleAddPropDesc = (newString) => {
    setPropDesc(prev => {
      if (prev.includes(newString)) return prev;
      return [...prev, newString];
    });
  };

  const handleRemovePropDesc = (item) => {
    setPropDesc(prev => prev.filter(v => v !== item));
  };


  // Reset type tags when category tab changes
  useEffect(() => {
    if (propDesc.length > 0) {
      setPropDesc([]);
    }
  }, [propCategory]);

  const propDropRef = useRef(null);

  // CLOSE PROPERTY TYPE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const clickOutside = (e) => {
      if (
        propDropRef.current &&
        !propDropRef.current.contains(e.target) &&
        !e.target.closest(".prop_desc")
      ) {
        setShowPropDesc(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // ---------------------------
  // BUDGET
  // ---------------------------
  const [budget, setBudget] = useState("");
  const [showBudget, setShowBudget] = useState(false);

  const handleDropdownClick = (which) => {
    setShowLocationDropdown(false);
    setShowPropDesc(false);
    setShowBudget(false);

    if (which === "location") setShowLocationDropdown(!showLocationDropdown);
    if (which === "propertyDesc") setShowPropDesc(!showPropDesc);
    if (which === "budget") setShowBudget(!showBudget);
  };

  // -----------------------------------------------
  // BUILD SEARCH URL AND REDIRECT TO /search
  // -----------------------------------------------
  const handleSearch = () => {
  const category = CATEGORY_MAP[propCategory];
  const maxPriceNumber = parseBudgetToNumber(budget);

  const selectedPropertyTypes = [];
  const selectedBhk = [];

  // Extract property types + BHK
  propDesc.forEach((tag) => {
      const bhkMatch = tag.toLowerCase().match(/^(\d+)\s*bhk$/);
      if (bhkMatch) {
        selectedBhk.push(parseInt(bhkMatch[1], 10));
      } else if (ALL_PROPERTY_TYPES.has(tag)) {
        selectedPropertyTypes.push(tag);
      }
    });

  // ░░ RULE CHECK: Remove BHK when not allowed ░░  
  const isResidentialOrNewProject =
    category === "Residential" || category === "New Project";

  const hasResidentialPlot = selectedPropertyTypes.includes("Residential Plot");

  let finalBhk = [];

  if (isResidentialOrNewProject && !hasResidentialPlot) {
    // BHK allowed
    finalBhk = selectedBhk;
  } else {
    // BHK NOT allowed → ignore/remove those values
    finalBhk = [];
  }

  // -----------------------------
  // BUILD QUERY PARAMS
  // -----------------------------
  const params = new URLSearchParams();
  console.log(selectedPropertyTypes)

  if (category) params.set("category", category);
  params.set("purpose", "Sell");

  if (maxPriceNumber) params.set("maxPrice", maxPriceNumber);

  if (locations.length > 0) params.set("locations", locations.join(","));

  if (selectedPropertyTypes.length > 0)
    params.set("type", selectedPropertyTypes.join(","));

  if (finalBhk.length > 0)
    params.set("bhk", finalBhk.join(",")); // only valid BHK apply

  params.set("tab", propCategory);
  console.log("params", params.toString())

  router.push(`/search?${params.toString()}`);
};

  // --------------------------------------------------
  // UI SECTION (NO CHANGES TO DESIGN)
  // --------------------------------------------------
  const scrollTargetRef = useRef(null);
  const isMobile = () => window.innerWidth < 768;

  useEffect(() => {
    if (showLocationDropdown && scrollTargetRef.current) {
      const delay = isMobile() ? 230 : 0;
      const timeout = setTimeout(() => {
        scrollTargetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [showLocationDropdown]);

  return (
    <div className="main">
      {/* ------------------------------------------------ */}
      {/* TABS */}
      {/* ------------------------------------------------ */}
      <div className="main_upper">
        <div className="prop_type_container">
          {["Residential", "Commercial", "New Project", "Land"].map(
            (tab) => (
              <div
                key={tab}
                className={`prop_type ${
                  propCategory === tab ? "focus" : ""
                }`}
                onClick={() => setPropCategory(tab)}
              >
                {tab}
              </div>
            )
          )}
          <a href="/post-property" className="prop_type">
            Post Free Property
          </a>
        </div>
        <span className="underline"></span>
      </div>

      {/* ------------------------------------------------ */}
      {/* SEARCH BAR */}
      {/* ------------------------------------------------ */}
      <div className="main_lower" ref={scrollTargetRef}>
        <div className="searchbar">
          {/* LOCATION */}
          <div
            className="location_div_container"
            onClick={() => handleDropdownClick("location")}
          >
            <IoLocationSharp className="icon" />
            <div className="location_div">
              {locations.length > 0 ? (
                <>
                  <div className="location">
                    {shortenedLocationName}
                    <RxCross2
                      className="cross_icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLocation(locations[0]);
                      }}
                    />
                  </div>

                  {locations.length > 1 && (
                    <div className="count open_flex">
                      +{locations.length - 1}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Add more..."
                    value={locationInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && locationInput)
                        handleAddLocation(locationInput);
                      else if (e.key === "Enter" && suggestions.length > 0)
                        handleAddLocation(suggestions[0]);
                    }}
                    className="input2"
                  />
                </>
              ) : (
                <input
                  type="text"
                  placeholder="Enter Locality, Project (Indore)"
                  value={locationInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && locationInput)
                      handleAddLocation(locationInput);
                    else if (e.key === "Enter" && suggestions.length > 0)
                      handleAddLocation(suggestions[0]);
                  }}
                  className="input1"
                />
              )}
            </div>
          </div>

          {/* PROPERTY TYPE + BUDGET */}
          <div className="row-container">
            {/* Property Type */}
            <div
              className="prop_desc"
              onClick={() => handleDropdownClick("propertyDesc")}
            >
              <FaHouse className="icon" />
              <div className="prop_desc_div">
                {propDesc.length > 0 ? (
                  <>
                    <div className="prop_desc_show">
                      {shortenedPropertyDescName}
                    </div>
                    {propDesc.length > 1 && (
                      <div className="count open_flex">
                        +{propDesc.length - 1}
                      </div>
                    )}
                    <span>
                      {showPropDesc ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <p>Property Type</p>
                    <span>
                      {showPropDesc ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Budget */}
            <div
              className="budget_div"
              onClick={() => handleDropdownClick("budget")}
            >
              <RiMoneyRupeeCircleFill className="icon rupee_icon" />
              <p className="budgetinput">
                {budget ? `${budget}` : "Mx. Budget"}
              </p>
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="search_button" onClick={handleSearch}>
            <IoSearch className="searchicon" />
            Search
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* DROPDOWNS */}
      {/* ------------------------------------------------ */}

      {/* LOCATION DROPDOWN */}
      <div className={`dropdown ${!showLocationDropdown ? "down_dropdown" : ""}`}>
        <div
          ref={dropdownRef}
          className={`location_keyword_container ${
            showLocationDropdown ? "open_flex" : ""
          }`}
        >
          {locations.length > 0 && (
            <div className="locations_div">
              {locations.map((item) => (
                <div key={item} className="location">
                  {item.length >= 9 ? item.substring(0, 8) + ".." : item}
                  <RxCross2
                    className="cross_icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLocation(item);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="suggestions_container">
            <div className="keywords_div">
              <p>
                {locationInput
                  ? "LIVE SEARCH RESULTS"
                  : "POPULAR LOCATIONS IN INDORE"}
              </p>
              <ul>
                {suggestions.length > 0 ? (
                  suggestions.map((sug) => (
                    <li key={sug} onClick={() => handleAddLocation(sug)}>
                      {sug}
                    </li>
                  ))
                ) : (
                  <li>No locations found matching "{locationInput}"</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* PROPERTY TYPE DROPDOWN */}
        <div
          ref={propDropRef}
          className={`prop_type_keyword_dropdown_container ${
            showPropDesc ? "open_block" : ""
          }`}
        >
          <ProptypeDrop
            propType={propCategory}
            isPropOpen={showPropDesc}
            addPropDesc={handleAddPropDesc}
            removePropDesc={handleRemovePropDesc}
            selectedList={propDesc}
          />

        </div>

        {/* BUDGET DROPDOWN */}
        <div ref={budgetDropRef}
          className={`budget_dropdown_container ${
            showBudget ? "open_block" : ""
          }`}
        >
          <div className="budget_dropdown">
            <p>Choose Maximum</p>
            
            <ul onClick={() => handleDropdownClick()}>
              {[
                "10 lakh",
                "20 lakh",
                "30 lakh",
                "40 lakh",
                "50 lakh",
                "60 lakh",
                "70 lakh",
                "80 lakh",
                "90 lakh",
                "1 Cr",
                "1.5 Cr",
                "2 Cr",
                "2.5 Cr",
                "3 Cr",
                "5 Cr",
                "10 Cr",
                "20 Cr",
              ].map((v) => (
                <li key={v} onClick={() => setBudget(v)}>
                  ₹{v}
                </li>
              ))}
            </ul>
            
          </div>
        </div>
      </div>
    </div>
  );
}
