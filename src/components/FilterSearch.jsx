// src/components/FilterSearch.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import "../styles/filterSearch.scss";

import ProptypeDrop from "./ProptypeDrop";
import { INDORE_LOCATIONS } from "../data/IndoreLocations";

// Icons
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

// ---------------------------
// CATEGORY MAP
// ---------------------------
const CATEGORY_MAP = {
  Residential: "Residential",
  "New Project": "New Project",
  Commercial: "Commercial",
  Land: "Land",
};

// ---------------------------
// PROPERTY TYPE MASTER LIST
// ---------------------------
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

function FilterSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ---------------------------
  // STATE
  // ---------------------------
  const [prop_type, setProp_type] = useState("Residential");
  const [showPropType, setShowPropType] = useState(false);

  const shortenedPropTypeName =
    prop_type && prop_type.length > 5
      ? prop_type.substring(0, 6) + ".."
      : prop_type || "";

  const [locations, setLocations] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const firstLocation = locations[0];
  const shortenedLocationName =
    firstLocation && firstLocation.length >= 9
      ? firstLocation.substring(0, 6) + ".."
      : firstLocation || "";

  const [budget, setBudget] = useState("");
  const [showBudget, setShowBudget] = useState(false);

  const [propDesc, setPropDesc] = useState([]);
  const [showPropDesc, setShowPropDesc] = useState(false);

  const firstPropertyDesc = propDesc[0];
  const shortenedPropertyDescName =
    firstPropertyDesc && propDesc.length > 1
      ? firstPropertyDesc.substring(0, 9) + ".."
      : firstPropertyDesc && firstPropertyDesc.substring(0, 10) + "..";

  const dropdownRef = useRef(null);

  // ---------------------------
  // HYDRATE FROM URL (FIRST LOAD)
  // ---------------------------
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);

  useEffect(() => {
    if (initializedFromUrl) return;

    const sp = searchParams;
    const urlTab = sp.get("tab");
    const urlCategory = sp.get("category");
    const urlLocations = sp.get("locations");
    const urlTypes = sp.get("type");
    const urlBhk = sp.get("bhk");
    const urlMaxPrice = sp.get("maxPrice");

    // tab → prop_type
    if (urlTab && Object.keys(CATEGORY_MAP).includes(urlTab)) {
      setProp_type(urlTab);
    } else if (urlCategory) {
      const foundTab = Object.entries(CATEGORY_MAP).find(
        ([, cat]) => cat === urlCategory
      );
      if (foundTab) setProp_type(foundTab[0]);
    }

    if (urlLocations) {
      const list = urlLocations.split(",").map((l) => l.trim());
      if (list.length) setLocations(list);
    }

    if (urlMaxPrice) {
      const n = Number(urlMaxPrice);
      if (!isNaN(n) && n > 0) setBudget(n);
    }

    const tags = [];

    if (urlTypes) {
      urlTypes.split(",").forEach((t) => tags.push(t.trim()));
    }

    if (urlBhk) {
      urlBhk.split(",").forEach((b) => tags.push(`${b.trim()} BHK`));
    }

    if (tags.length) setPropDesc(tags);

    setInitializedFromUrl(true);
  }, [searchParams]);

  // ---------------------------
  // LOCATION HANDLERS
  // ---------------------------
  const filterSuggestions = (query) => {
    if (!query.trim()) return INDORE_LOCATIONS.slice(0, 8);
    const lower = query.toLowerCase();
    return INDORE_LOCATIONS.filter(
      (item) => item.toLowerCase().includes(lower) && !locations.includes(item)
    ).slice(0, 10);
  };

  const handleAddLocation = (newLocation) => {
    if (newLocation && !locations.includes(newLocation)) {
      const updated = [...locations, newLocation];
      setLocations(updated);
      setLocationInput("");
      setSuggestions(filterSuggestions(""));
    }
  };

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

  const handleInputChange = (e) => {
    const query = e.target.value;
    setLocationInput(query);
    closeAllDropdown();
    setShowLocationDropdown(true);
    setSuggestions(query ? filterSuggestions(query) : filterSuggestions(""));
  };

  // outside click for location dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".location_div_container")
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // default suggestions
  useEffect(() => {
    if (showLocationDropdown && !locationInput) {
      setSuggestions(filterSuggestions(""));
    }
  }, [showLocationDropdown, locationInput]);

  // ---------------------------
  // BUDGET FORMATTER
  // ---------------------------
  const formatIndianPrice = (price) => {
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return "₹ 0";
    }
    const THOUSAND = 1000;
    const LAKH = 100000;
    const CR = 10000000;

    if (price >= CR)
      return `₹ ${(price / CR).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })} Cr`;

    if (price >= LAKH)
      return `₹ ${(price / LAKH).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })} Lakh`;

    if (price >= THOUSAND)
      return `₹ ${(price / THOUSAND).toLocaleString("en-IN", {
        maximumFractionDigits: 1,
      })} K`;

    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  // ---------------------------
  // PROPERTY TYPE TAGS
  // ---------------------------
  const handleAddPropDesc = (newString) => {
    setPropDesc(prev => {
        if (prev.includes(newString)) return prev;
        return [...prev, newString];
    });
  };

  const handleRemovePropDesc = (item) => {
    setPropDesc(prev => prev.filter(v => v !== item));
  };
  
  const handleDropdownClick = (dropdownName) => {
    setShowPropType(false);
    setShowLocationDropdown(false);
    setShowBudget(false);
    setShowPropDesc(false);

    if (dropdownName === "budget") setShowBudget(!showBudget);
    if (dropdownName === "proptype") setShowPropType(!showPropType);
    if (dropdownName === "location") setShowLocationDropdown(!showLocationDropdown);
    if (dropdownName === "propdesc") setShowPropDesc(!showPropDesc);
  };

  const closeAllDropdown = () => {
    setShowPropType(false);
    setShowLocationDropdown(false);
    setShowBudget(false);
    setShowPropDesc(false);
  };

  const handleProptype = (value) => {
    setPropDesc([]);  
    setProp_type(value);
    setShowPropType(false);
  };

  // ---------------------------
  // SCROLL MOTION
  // ---------------------------
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterHidden, setIsFilterHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const threshold = 100;

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useMotionValueEvent(scrollY, "change", (latestY) => {
    if (!isMobile) {
      setIsFilterHidden(false);
      return;
    }

    const delta = latestY - lastY.current;
    const scrollingDown = delta > 0;
    const scrollingUp = delta < 0;

    let newState = isFilterHidden;

    if (scrollingUp || latestY <= threshold) newState = false;
    else if (scrollingDown) newState = true;

    if (newState !== isFilterHidden) setIsFilterHidden(newState);

    lastY.current = latestY;
  });

  useEffect(() => {
    if (showLocationDropdown || showBudget || showPropDesc || showPropType) {
      setIsFilterHidden(false);
    }
  }, [showLocationDropdown, showBudget, showPropDesc, showPropType]);

  const filterVariants = {
    visible: {
      y: 0,
      transition: { type: "tween", ease: "easeInOut", duration: 0.2 },
    },
    hidden: {
      y: "-88px",
      transition: { type: "tween", ease: "easeInOut", duration: 0.2 },
    },
  };

  const controlsState = isFilterHidden ? "hidden" : "visible";

  // ---------------------------
  // SYNC → URL instantly
  // ---------------------------

    useEffect(() => {
    if (!initializedFromUrl) return;

    const category = CATEGORY_MAP[prop_type];

    const selectedTypes = [];
    const selectedBhk = [];

    propDesc.forEach((tag) => {
      const bhkMatch = tag.match(/^(\d+)\s*bhk$/i);
      if (bhkMatch) {
        selectedBhk.push(parseInt(bhkMatch[1], 10));
      } else if (ALL_PROPERTY_TYPES.has(tag)) {
        selectedTypes.push(tag);
      }
    });

    const params = new URLSearchParams();

    if (category) params.set("category", category);
    params.set("purpose", "Sell");
    if (locations.length) params.set("locations", locations.join(","));
    if (budget) params.set("maxPrice", String(budget));
    if (selectedTypes.length) params.set("type", selectedTypes.join(","));
    if (selectedBhk.length) params.set("bhk", selectedBhk.join(","));
    params.set("tab", prop_type);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [prop_type, locations, budget, propDesc, initializedFromUrl]);

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <section className="search_filter_section">
      <motion.div
        className="search_filter_container fixed-position"
        variants={filterVariants}
        animate={controlsState}
        initial="visible"
      >
        {/* ========== TOP SEARCH BAR ========== */}
        <div className="filter_searchbar_container">
          <div className="filter_search_div_container">
            <div className="filter-search-div">
              {/* Prop Type Tab */}
              <button
                className="prop_button desktop_only"
                onClick={() => handleDropdownClick("proptype")}
              >
                {prop_type}{" "}
                <span>
                  {showPropType ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </span>
              </button>

              <button
                className="prop_button mobile_only"
                onClick={() => handleDropdownClick("proptype")}
              >
                {shortenedPropTypeName}{" "}
                <span>
                  {showPropType ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </span>
              </button>

              {/* Location Box */}
              <div className="filter_location_div">
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

                    {locations.length - 1 > 0 && (
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
          </div>
        </div>

        {/* ========== PROPERTY TYPE TAGS ========== */}
        <div
          className="filter_prop_type filter_item"
          onClick={() => handleDropdownClick("propdesc")}
        >
          {propDesc.length > 0 ? (
            <>
              <div className="wrapper">
                <div className="prop_desc_show">
                  {firstPropertyDesc && firstPropertyDesc.length > 11
                    ? shortenedPropertyDescName
                    : firstPropertyDesc}
                </div>
                <div
                  className={
                    propDesc.length - 1 > 0 ? "count open_flex" : "count"
                  }
                >
                  +{propDesc.length - 1}
                </div>
              </div>
              <span>
                {showPropDesc ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </span>
            </>
          ) : (
            <>
              Property Type{" "}
              <span>
                {showPropDesc ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </span>
            </>
          )}
        </div>

        {/* ========== BUDGET ========== */}
        {budget ? (
          <div
            className="filter_budget filter_item"
            onClick={() => handleDropdownClick("budget")}
          >
            {formatIndianPrice(budget)}
            <span>
              {showBudget ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </span>
          </div>
        ) : (
          <div
            className="filter_budget filter_item"
            onClick={() => handleDropdownClick("budget")}
          >
            Budget{" "}
            <span>
              {showBudget ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </span>
          </div>
        )}
      </motion.div>

      {/* ========== DROPDOWNS ========== */}
      <section className="filter_search_dropdown_section">
        <div
          className={`bg_blur ${
            showPropType || showLocationDropdown || showBudget || showPropDesc
              ? "open_block"
              : ""
          }`}
          onClick={closeAllDropdown}
        ></div>

        {/* Prop-Type MAIN TABS */}
        <div
          className={`filter_prop_dropdown ${
            showPropType ? "open_flex" : ""
          }`}
        >
          <ul onClick={() => handleDropdownClick("")}>
            <li onClick={() => handleProptype("Residential")}>Residential</li>
            <li onClick={() => handleProptype("Commercial")}>Commercial</li>
            <li onClick={() => handleProptype("New Project")}>
              New Project
            </li>
            <li onClick={() => handleProptype("Land")}>Land</li>
          </ul>
        </div>

        {/* LOCATION DROPDOWN */}
        <div
          ref={dropdownRef}
          className={`filter_location_keyword_container ${
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
                  <li>
                    No locations or projects found matching "{locationInput}".
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* PROPERTY TYPE TAGS DROPDOWN */}
        <div
          className={`filter_prop_type_keyword_dropdown_container ${
            showPropDesc ? "open_block" : ""
          }`}
        >
          <ProptypeDrop
            propType={prop_type}
            isPropOpen={showPropDesc}
            addPropDesc={handleAddPropDesc}
            removePropDesc={handleRemovePropDesc}
            selectedList={propDesc}
          />
        </div>

        {/* BUDGET DROPDOWN */}
        <div
          className={`filter_budget_dropdown ${
            showBudget ? "open_flex" : ""
          }`}
        >
          <p>Choose Maximum</p>
          <ul onClick={() => handleDropdownClick("")}>
            <li onClick={() => setBudget(2500000)}>₹25 lakh</li>
            <li onClick={() => setBudget(3000000)}>₹30 lakh</li>
            <li onClick={() => setBudget(4000000)}>₹40 lakh</li>
            <li onClick={() => setBudget(5000000)}>₹50 lakh</li>
            <li onClick={() => setBudget(6000000)}>₹60 lakh</li>
            <li onClick={() => setBudget(7000000)}>₹70 lakh</li>
            <li onClick={() => setBudget(8000000)}>₹80 lakh</li>
            <li onClick={() => setBudget(10000000)}>₹1 Crore</li>
            <li onClick={() => setBudget(15000000)}>₹1.5 Crore</li>
            <li onClick={() => setBudget(20000000)}>₹2 Crore</li>
            <li onClick={() => setBudget(50000000)}>₹5 Crore</li>
            <li onClick={() => setBudget(100000000)}>₹10 Crore</li>
          </ul>
        </div>
      </section>
    </section>
  );
}

export default FilterSearch;
