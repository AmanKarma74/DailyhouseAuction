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

const BrokerBuilderFields = ({
  listingUser,
  formData,
  handleChange,
  handleIDProofUpload,
}) => {
  return (
    <>
      <h3 className="section-title">{listingUser} Details</h3>

      {/* ID PROOF UPLOAD (required for Broker/Builder) */}
      <div className="form-group">
        <small className="input-hint">Upload ID Proof (Required)</small>
        <input
         type="file"
         accept="image/*"
         onChange={handleIDProofUpload}
         className="auth-input-detail"
        />
        {!formData.idProof && (
        <small className="input-hint error">ID Proof is required *</small>
        )}

      </div>

      <CustomInput
        name="dateOfBirth"
        type="date"
        placeholder="Date of Birth"
        value={formData.dateOfBirth}
        onChange={handleChange}
      />

      <CustomInput
        name="businessName"
        required
        placeholder={`${listingUser} Business Name`}
        value={formData.businessName}
        onChange={handleChange}
      />

      <CustomInput
        name="officeAddress"
        required
        placeholder="Office Address"
        value={formData.officeAddress}
        onChange={handleChange}
      />

      <CustomInput
        name="operatingSince"
        type="number"
        required
        placeholder="Operating Since"
        value={formData.operatingSince}
        onChange={handleChange}
      />

      <CustomInput
        name="workingArea"
        required
        placeholder="Working Area"
        value={formData.workingArea}
        onChange={handleChange}
      />
    </>
  );
};

export default BrokerBuilderFields;
