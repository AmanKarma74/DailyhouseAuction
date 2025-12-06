"use client";

import React, { useState, useEffect, useRef } from "react";
import "../styles/profileDetailsClient.scss";
import Image from "next/image";
import defaultprofile from "../../public/assets/men_img.jpg";
import { CiEdit } from "react-icons/ci";
import Link from "next/link";

function ProfileDetailsClient({ userData }) {
  const [details, setDetails] = useState(userData);
  const [editDetails, setEditDetails] = useState(userData);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState({
    type: "",
    message: "",
  });

  // Auto-hide feedback message after 3 seconds
    useEffect(() => {
    if (!feedbackMessage.message) return;

    const timer = setTimeout(() => {
        setFeedbackMessage({ type: "", message: "" });
    }, 3000);

    return () => clearTimeout(timer);
    }, [feedbackMessage.message]);



  const fileInputRef = useRef(null);

  // ------------------------
  // 📌 Handle Text Fields
  // ------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------
  // 📌 Profile Picture Upload
  // ------------------------
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const previewURL = URL.createObjectURL(file);
    setEditDetails((prev) => ({ ...prev, profilePicturePreview: previewURL }));

    const formData = new FormData();
    formData.append("profilePicture", file);

    const res = await fetch("/api/user/profile-picture", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setDetails((prev) => ({
        ...prev,
        profilePicUrl: data.url,
      }));

      setEditDetails((prev) => ({
        ...prev,
        profilePicUrl: data.url,
        profilePicturePreview: null,
      }));
    }
  };

  // DOB formatting for input field
  const getDOBInputValue = () => {
    if (!editDetails.dateOfBirth) return "";
    const d = new Date(editDetails.dateOfBirth);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // ------------------------
  // 📌 Save Profile Details
  // ------------------------
  const handleSave = async () => {
    setIsSaving(true);
    setFeedbackMessage({ type: "", message: "" });

    const payload = {
      name: editDetails.name,
      number: editDetails.number,
      residentialAddress: editDetails.residentialAddress,
      dateOfBirth: editDetails.dateOfBirth,
      occupation: editDetails.occupation,
      businessName: editDetails.businessName,
      operatingSince: editDetails.operatingSince,
      workingArea: editDetails.workingArea,
      officeAddress: editDetails.officeAddress,
    };

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedbackMessage({
          type: "error",
          message: data.message || "Failed to update profile.",
        });
        setIsSaving(false);
        return;
      }

      setDetails(data.user);
      setEditDetails(data.user);

      setFeedbackMessage({
        type: "success",
        message: "Profile updated successfully!",
      });

      setIsEditing(false);
    } catch (err) {
      setFeedbackMessage({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ------------------------
  // 📌 Cancel Editing
  // ------------------------
  const handleCancel = () => {
    setEditDetails(details);
    setFeedbackMessage({ type: "", message: "" });
    setIsEditing(false);
  };

  // ------------------------
  // 📌 Field Rendering Helper
  // ------------------------
  const renderDetailField = (key, label, typeOverride) => {
    const isDate = key === "dateOfBirth";

    return (
      <div className="userDetailWrapper" key={key}>
        <li>{label}</li>

        {isEditing ? (
          <li>
            <input
              type={
                isDate ? "date" : key === "number" ? "tel" : typeOverride || "text"
              }
              name={key}
              value={isDate ? getDOBInputValue() : editDetails[key] || ""}
              onChange={(e) => {
                if (isDate) {
                  setEditDetails((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value,
                  }));
                } else {
                  handleInputChange(e);
                }
              }}
              className="edit-input"
              disabled={isSaving || key === "email" || key === "role"}
            />
          </li>
        ) : (
          <li>
            {isDate && details.dateOfBirth
              ? new Date(details.dateOfBirth).toLocaleDateString()
              : details[key] || `Enter ${label}`}
          </li>
        )}
      </div>
    );
  };

  // Scroll to top when entering edit mode
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isEditing]);

  return (
    <>
      {/* ------------------------ */}
      {/* 📌 Profile Header */}
      {/* ------------------------ */}
      <div className="profile-header">
        <div
          className={`profile-pic-wrapper ${isEditing ? "is-editing" : ""}`}
          onClick={() => isEditing && fileInputRef.current.click()}
        >
            <div className="icon_wrapper"><CiEdit className="pic_edit_icon"/></div>

          <Image
            src={
              editDetails.profilePicturePreview ||
              editDetails.profilePicUrl ||
              defaultprofile
            }
            alt="Profile"
            className="profile-pic"
            width={100}
            height={100}
          />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="greeting">
          <h1 className="greeting_name">Hello, {details.name} 👋</h1>
          <p className="greeting_office">
            {details.role}{" "}
            {details.role !== "Buyer"
              ? `| ${details.businessName || details.listingUser || "Namaste Malik"}`
              : "| Profile Page"}
          </p>
        </div>
      </div>

      {/* ------------------------ */}
      {/* 📌 Feedback Message */}
      {/* ------------------------ */}
      {feedbackMessage.message && (
        <div
          className={`feedback-message ${
            feedbackMessage.type === "error" ? "error" : "success"
          }`}
        >
          {feedbackMessage.message}
        </div>
      )}

      {/* ------------------------ */}
      {/* 📌 Details Section */}
      {/* ------------------------ */}
      <div className="broker-details-container">
        <h2 className="my_details_heading">My Details</h2>

        <div className="personal_info">
          <ul className="personal_info_heading">
            {renderDetailField("name", "Name")}
            {renderDetailField("number", "Number")}
            {renderDetailField("email", "Email")}
            {renderDetailField("role", "Role")}
            {renderDetailField("residentialAddress", "Residential Address")}

            {details.role !== "Buyer" &&
              renderDetailField("dateOfBirth", "Date of Birth")}

            {details.listingUser === "Owner" &&
              renderDetailField("occupation", "Occupation")}

            {(details.listingUser === "Broker" ||
              details.listingUser === "Builder") && (
              <>
                {renderDetailField("businessName", "Office Name")}
                {renderDetailField("operatingSince", "Operating Since")}
                {renderDetailField("workingArea", "Working Area")}
                {renderDetailField("officeAddress", "Office Address")}
              </>
            )}
          </ul>
        </div>

        {/* ------------------------ */}
        {/* 📌 Edit / Save / Cancel */}
        {/* ------------------------ */}
        {isEditing ? (
          <div className="edit-buttons-group">
            <button className="save-btn" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button className="cancel-btn" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="info_edit_btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>

      {/* ONBOARDING STATUS */}
{details.onboarded && !details.isApproved && !details.rejectReason ? (
  <div className="onboarding-status-box pending">
    <h3>⏳ Approval Pending</h3>
    <p>Your onboarding request is under review.</p>
  </div>
) : null}
{details.onboarded && !details.isApproved && details.rejectReason ? (
  <div className="onboarding-status-box pending">
      <h3>🚫 Approval Rejected</h3>
      <p>Your onboarding request is rejected.</p>
      <div className="rejection-wrapper">
          <p className="reject-info">
          <strong>Rejected Reason:</strong> {details.rejectReason}
          </p>

          <Link href="/onboarding">
          <button className="apply-again-btn">Apply Again</button>
          </Link>
      </div>
    </div>
) : null}

    </>
  );
}

export default ProfileDetailsClient;
