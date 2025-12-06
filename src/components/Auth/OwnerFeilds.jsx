import React from "react";

const CustomInput = ({
  name,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
}) => (
  <div className="form-group">
    <input
      className="auth-input-detail"
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder + (required ? " *" : "")}
      required={required}
    />
  </div>
);

const OwnerFields = ({ formData, handleChange, handleIDProofUpload }) => {
  return (
    <>
      <h3 className="section-title">Owner Details</h3>

      {/* ID PROOF UPLOAD */}
      <div className="form-group">
        <small className="input-hint">Upload ID Proof (Optional)</small>
        <input
          type="file"
          accept="image/*"
          onChange={handleIDProofUpload}
          className="auth-input-detail"
        />
      </div>

      <CustomInput
        name="dateOfBirth"
        type="date"
        placeholder="Date of Birth"
        value={formData.dateOfBirth}
        onChange={handleChange}
      />

      <CustomInput
        name="occupation"
        placeholder="Occupation"
        value={formData.occupation}
        onChange={handleChange}
        required
      />
    </>
  );
};

export default OwnerFields;
