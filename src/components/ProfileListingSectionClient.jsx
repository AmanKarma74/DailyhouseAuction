"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "../app/profile/brokerProfile.scss";
import Dealer from "../../public/assets/men_img.jpg";

export default function ProfileListingSectionClient({
  title,
  listings,
  isEditable = false,
  isListingSection = false,
}) {
  const [localListings, setLocalListings] = useState(listings);

  // --------------------------------------------
  //  ✅ DELETE PROPERTY FUNCTION
  // --------------------------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to delete property");
        return;
      }

      // Optimistic UI update — remove property from UI instantly
      setLocalListings((prev) => prev.filter((item) => item._id !== id));

      alert("Property deleted successfully!");

    } catch (error) {
      console.error("Delete failed:", error);
      alert("Something went wrong while deleting the property.");
    }
  };

  const listCount = localListings?.length || 0;

  return (
    <div className="listings-section">
      <div className="listings-header">
        <h2>{title}</h2>

        {isListingSection && (
          <Link href="/post-property">
            <button className="post-btn">
              {listCount > 0 ? "+ Post Another Property" : "+ Post Property"}
            </button>
          </Link>
        )}
      </div>

      <div className="listings">
        {listCount > 0 ? (
          <div className="listings_slider">
            {localListings.map((item) => (
              <div key={item._id} className="listing-card">
                <Image
                  src={
                    item.propertyImage && item.propertyImage.length > 0
                      ? item.propertyImage[0]
                      : Dealer
                  }
                  alt="Property Image"
                  width={300}
                  height={200}
                  className="listing-image"
                />

                <div className="listing-details">
                  <h3>
                    {`${item.propertyType || item.propertyCategory} for ${
                      item.postingPurpose
                    } in ${item.location}`}
                  </h3>

                  <p>{item.location}</p>

                  <p className="price">
                    ₹{Number(item.price || 0).toLocaleString("en-IN")}
                  </p>

                  <div className="listing-buttons">
                    {isEditable ? (
                      <>
                        <Link href={`/post-property/${item._id}`}>
                          <button className="edit-btn">Edit</button>
                        </Link>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href={`/property/${item._id}`}>
                          <button className="edit-btn">View Property</button>
                        </Link>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            console.log(`Unlike action for ${item._id}`)
                          }
                        >
                          Unlike
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="no-property-text" style={{ color: "grey" }}>
            No Property {title.includes("Favourite") ? "Liked" : "Listed"}
          </h3>
        )}
      </div>
    </div>
  );
}
