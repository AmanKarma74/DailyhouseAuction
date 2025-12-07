"use client";
import React, { useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";
import "../styles/recommendPropSection.scss";

import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";

function RecommendPropSection({ cardData}) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardContainerRef = useRef(null);

  const totalCards = cardData.length;
  const visibleCards = 4; // your UI already expects 4 visible

  const maxIndex = Math.max(0, totalCards - visibleCards);

  const handleNextCard = () => {
    setActiveCardIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePreviousCard = () => {
    setActiveCardIndex((prev) => Math.max(prev - 1, 0));
  };

  // Move slider
  useEffect(() => {
    const cardContainer = cardContainerRef.current;
    if (
      cardContainer &&
      cardContainer.children.length > 0 &&
      activeCardIndex <= maxIndex
    ) {
      const cardWidth = cardContainer.children[0].offsetWidth;

      const gapStyle = window
        .getComputedStyle(cardContainer)
        .getPropertyValue("gap");
      const gapValue = parseFloat(gapStyle);

      const moveDistance = (cardWidth + gapValue) * activeCardIndex;
      cardContainer.style.transform = `translateX(-${moveDistance}px)`;
    }
  }, [activeCardIndex, cardData.length]);

  return (
    <section className="recommend_property_container">
      <div className="recommend_heading_div">
        <div className="left_heading">
          <h2>Handpicked Properties</h2>
          <span className="underline"></span>
        </div>
        <div className="right_heading">
          See all Properties <IoIosArrowRoundForward className="short_icon" />
        </div>
      </div>

      {/* LEFT ARROW */}
      <span
        className={
          activeCardIndex > 0
            ? "arrow_span arrow_left show_arrow"
            : "arrow_span arrow_left"
        }
        onClick={handlePreviousCard}
      >
        <BsArrowLeft />
      </span>

      <div className="recommend_property_cards_div">
        <div
          className="recommend_property_cards_div_slider"
          ref={cardContainerRef}
        >
          {cardData.map((item, index) => (
            <div key={index} className="card_holder_div">
              <PropertyCard data={item} />
            </div>
          ))}

          {/* If no data */}
          {cardData.length === 0 && (
            <p style={{ padding: "20px", color: "gray" }}>
              No recommended properties available.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT ARROW */}
      <span
        className={
          activeCardIndex < maxIndex
            ? "arrow_span arrow_right show_arrow"
            : "arrow_span arrow_right"
        }
        onClick={handleNextCard}
      >
        <BsArrowRight />
      </span>
    </section>
  );
}

export default RecommendPropSection;
