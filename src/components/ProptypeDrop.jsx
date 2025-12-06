"use client";
import React, { useState, useEffect } from "react";
import "../styles/proptypeDrop.scss";

function ProptypeDrop({
  propType,
  isPropOpen,
  addPropDesc,
  removePropDesc,
  selectedList = [],   // FIX: always safe
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedBhk, setSelectedBhk] = useState([]);

  const RESIDENTIAL_PLOT = "Residential Plot";

  const BHK_OPTIONS = [
    "1 Bhk",
    "2 Bhk",
    "3 Bhk",
    "4 Bhk",
    "5 Bhk",
    "5+ Bhk",
  ];

  // ---------------------------------------------------------
  // SYNC LOCAL STATE WITH PARENT (important for filterSearch)
  // ---------------------------------------------------------

  useEffect(() => {
  if (!Array.isArray(selectedList)) return;

  const types = selectedList.filter(
    (t) => !t.toLowerCase().includes("bhk")
  );
  const bhks = selectedList.filter(
    (t) => t.toLowerCase().includes("bhk")
  );

  // prevent infinite loop by comparing before setting
  const isSameItems =
    types.length === selectedItems.length &&
    types.every((t) => selectedItems.includes(t));

  const isSameBhk =
    bhks.length === selectedBhk.length &&
    bhks.every((b) => selectedBhk.includes(b));

  if (!isSameItems) setSelectedItems(types);
  if (!isSameBhk) setSelectedBhk(bhks);

}, [selectedList]);


  // ---------------------------------------------------------
  // MAIN PROPERTY TYPE CLICK
  // ---------------------------------------------------------
  const handleItemClick = (item) => {
    const isSelected = selectedItems.includes(item);

    if (isSelected) {
      // unselect
      removePropDesc(item);
      setSelectedItems((prev) => prev.filter((v) => v !== item));
      return;
    }

    // If selecting "Residential Plot" → clear ALL BHK
    if (
      (propType === "Residential" || propType === "New Projects") &&
      item === RESIDENTIAL_PLOT
    ) {
      if (selectedBhk.length > 0) {
        selectedBhk.forEach((bhk) => removePropDesc(bhk));
        setSelectedBhk([]);
      }
    }

    // Add the new property type
    setSelectedItems((prev) => [...prev, item]);
    addPropDesc(item);
  };


  // ---------------------------------------------------------
  // BHK CLICK
  // ---------------------------------------------------------
  const handleBhkClick = (bhk) => {
    const isSelected = selectedBhk.includes(bhk);

    if (isSelected) {
      removePropDesc(bhk);
      setSelectedBhk((prev) => prev.filter((v) => v !== bhk));
      return;
    }

    // If Residential Plot is selected → remove it
    if (selectedItems.includes(RESIDENTIAL_PLOT)) {
      removePropDesc(RESIDENTIAL_PLOT);
      setSelectedItems((prev) =>
        prev.filter((v) => v !== RESIDENTIAL_PLOT)
      );
    }

    setSelectedBhk((prev) => [...prev, bhk]);
    addPropDesc(bhk);
  };

  // ---------------------------------------------------------
  // RESET WHEN CATEGORY CHANGES
  // ---------------------------------------------------------
  useEffect(() => {
    // Parent already resets propDesc, we just sync UI
    setSelectedItems([]);
    setSelectedBhk([]);
  }, [propType]);

  // ---------------------------------------------------------
  // UI BELOW
  // ---------------------------------------------------------

  return (
    <div className={`prop_desc_dropdown ${isPropOpen ? "open_flex" : ""}`}>

      {/* RESIDENTIAL + NEW PROJECT */}
      {(propType === "Residential" || propType === "New Projects") && (
        <div className="information_div">
          <p>Residential</p>

          <div className="types_div">
            <ul>
              <li
                className={selectedItems.includes("Flat") ? "select" : ""}
                onClick={() => handleItemClick("Flat")}
              >Flat</li>

              <li
                className={selectedItems.includes("House") ? "select" : ""}
                onClick={() => handleItemClick("House")}
              >House</li>

              <li
                className={selectedItems.includes("Villa") ? "select" : ""}
                onClick={() => handleItemClick("Villa")}
              >Villa</li>

              <li
                className={selectedItems.includes("Farmhouse") ? "select" : ""}
                onClick={() => handleItemClick("Farmhouse")}
              >Farmhouse</li>

              {/* No Residential Plot for New Projects */}
              {propType === "New Projects" ? null : (
                <li
                  className={
                    selectedItems.includes(RESIDENTIAL_PLOT) ? "select" : ""
                  }
                  onClick={() => handleItemClick(RESIDENTIAL_PLOT)}
                >
                  Residential Plot
                </li>
              )}
            </ul>

            {/* BHK only when Residential Plot is NOT selected */}
            {!selectedItems.includes(RESIDENTIAL_PLOT) && (
              <ul>
                {BHK_OPTIONS.map((bhk) => (
                  <li
                    key={bhk}
                    className={selectedBhk.includes(bhk) ? "select" : ""}
                    onClick={() => handleBhkClick(bhk)}
                  >
                    {bhk}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* COMMERCIAL + NEW PROJECT */}
      {(propType === "Commercial" || propType === "New Projects") && (
        <div className="information_div">
          <p>Commercial</p>

          <div className="types_div">
            <ul>
              <li
                className={selectedItems.includes("Office Space") ? "select" : ""}
                onClick={() => handleItemClick("Office Space")}
              >Office Space</li>

              <li
                className={selectedItems.includes("Shop") ? "select" : ""}
                onClick={() => handleItemClick("Shop")}
              >Shop</li>

              {/* No commercial plot in New Projects */}
              {propType === "New Projects" ? null : (
                <li
                  className={selectedItems.includes("Commercial Plot") ? "select" : ""}
                  onClick={() => handleItemClick("Commercial Plot")}
                >
                  Commercial Plot
                </li>
              )}

              <li
                className={selectedItems.includes("Showroom") ? "select" : ""}
                onClick={() => handleItemClick("Showroom")}
              >Showroom</li>

              <li
                className={selectedItems.includes("Warehouse") ? "select" : ""}
                onClick={() => handleItemClick("Warehouse")}
              >Warehouse</li>

              <li
                className={selectedItems.includes("Godown") ? "select" : ""}
                onClick={() => handleItemClick("Godown")}
              >Godown</li>
            </ul>
          </div>
        </div>
      )}

      {/* LAND */}
      {propType === "Land" && (
        <div className="information_div">
          <p>Land</p>

          <div className="types_div">
            <ul>
              <li
                className={selectedItems.includes("Residential Land") ? "select" : ""}
                onClick={() => handleItemClick("Residential Land")}
              >Residential Land</li>

              <li
                className={selectedItems.includes("Commercial Land") ? "select" : ""}
                onClick={() => handleItemClick("Commercial Land")}
              >Commercial Land</li>

              <li
                className={selectedItems.includes("Agricultural Land") ? "select" : ""}
                onClick={() => handleItemClick("Agricultural Land")}
              >Agricultural Land</li>

              <li
                className={selectedItems.includes("Industrial Land") ? "select" : ""}
                onClick={() => handleItemClick("Industrial Land")}
              >Industrial Land</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProptypeDrop;
