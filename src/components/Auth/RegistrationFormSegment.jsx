import React from "react";
import OwnerFields from "./OwnerFeilds";
import BrokerBuilderFields from "./BrokerBuilderFeilds";

const RegistrationFormSegment = ({
  listingUser,
  formData,
  handleChange,
  handleIDProofUpload,
}) => {
  return (
    <div className="form-section conditional-section">
      {listingUser === "Owner" && (
        <OwnerFields
          formData={formData}
          handleChange={handleChange}
          handleIDProofUpload={handleIDProofUpload}
        />
      )}

      {(listingUser === "Broker" || listingUser === "Builder") && (
        <BrokerBuilderFields
          listingUser={listingUser}
          formData={formData}
          handleChange={handleChange}
          handleIDProofUpload={handleIDProofUpload}
        />
      )}
    </div>
  );
};

export default RegistrationFormSegment;
