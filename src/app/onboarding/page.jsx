"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import RegistrationFormSegment from "@/components/Auth/RegistrationFormSegment";
import "./registration.scss";

const OnboardingPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();


  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return; // still checking session

    if (!session) {
      router.push(`/auth?redirect_to=/onboarding`);
      return;
    }
  }, [session, status, router]);

  // 🚀 Fetch actual logged-in user
  useEffect(() => {
    if (!session) return;
    
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (!res.ok) {
          setError("Failed to load user details");
          setIsLoading(false);
          return;
        }

        // If onboarding already done → redirect to profile
        if (data.user.onboarded && !data.user.rejectReason) {
          router.push("/profile");
          return;
        }

        setFormData({
          ...data.user,
          idProof: null,
          dateOfBirth: "",
          businessName: "",
          officeAddress: "",
          operatingSince: "",
          workingArea: "",
          occupation: "",
        });

        setIsLoading(false);
      } catch (err) {
        setError("Unable to load profile");
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Handle normal input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 Handle ID Proof Upload (Cloudinary)
  const handleIDProofUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append("image", file);
    body.append("folder", "dailyhouse/idproof");

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await uploadRes.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, idProof: data.url }));
      } else {
        setError("Image upload failed. Try again.");
      }
    } catch (err) {
      console.log(err);
      setError("Image upload error.");
    }
  };

  // Required fields logic
  const requiredFields = useMemo(() => {
    let base = ["listingUser"];

    if (formData.listingUser === "Owner") {
      return [...base, "occupation"];
    }

    if (formData.listingUser === "Broker" || formData.listingUser === "Builder") {
      return [
        ...base,
        "idProof",
        "businessName",
        "officeAddress",
        "operatingSince",
        "workingArea",
      ];
    }

    return base;
  }, [formData.listingUser]);

  const isButtonDisabled = useMemo(() => {
  return requiredFields.some((field) => {
    const value = formData[field];
    return (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    );
  });
}, [formData, requiredFields]);


  // 🚀 Submit Onboarding Details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isButtonDisabled) {
      setError("Please fill all required fields.");
      return;
    }

    setSubmitLoading(true);

    const payload = {
      listingUser: formData.listingUser,
      occupation: formData.occupation,
      businessName: formData.businessName,
      operatingSince: formData.operatingSince,
      workingArea: formData.workingArea,
      officeAddress: formData.officeAddress,
      dateOfBirth: formData.dateOfBirth,
      idProof: formData.idProof,
    };

    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSubmitLoading(false);

      if (res.ok) {
        alert(data.message);
        router.push("/profile");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setSubmitLoading(false);
      setError("Something went wrong.");
    }
  };

  if (isLoading) return <div className="loading-state">Loading Profile...</div>;

  return (
    <div className="profile-page-container">
      <form className="profile-detail-form" onSubmit={handleSubmit}>
        <h3 className="brand-logo">Dailyhouse</h3>
        <h2 className="profile-header">Complete Your Profile</h2>

        {error && <p className="auth-error">{error}</p>}

        {/* USER TYPE SELECTOR */}
        <div className="form-section user-type-section">
          <label className="section-label">Who are you?</label>
          <div className="radio-group">
            {["Owner", "Broker", "Builder"].map((type) => (
              <label
                key={type}
                className={`type-option ${
                  formData.listingUser === type ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="listingUser"
                  value={type}
                  checked={formData.listingUser === type}
                  onChange={handleChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* READ-ONLY SIGNUP FIELDS */}
        <div className="form-section">
          <h3 className="section-title">Your Basic Details</h3>

          <input className="auth-input-detail" disabled value={formData.name || ""} />

          <input className="auth-input-detail" disabled value={formData.email || ""} />

          <input className="auth-input-detail" disabled value={formData.number || ""} />

          <input
            className="auth-input-detail"
            disabled
            value={formData.residentialAddress || ""}
          />
        </div>

        {/* CONDITIONAL FIELDS */}
        {formData.listingUser && (
          <RegistrationFormSegment
            listingUser={formData.listingUser}
            formData={formData}
            handleChange={handleChange}
            handleIDProofUpload={handleIDProofUpload}
          />
        )}

        <button
          type="submit"
          className="auth-submit-btn-registration large-btn"
          disabled={isButtonDisabled || submitLoading}
        >
          {submitLoading ? "Submitting..." : "Complete Profile & Post Property"}
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;
