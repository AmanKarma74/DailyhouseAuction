"use client"
import React, { useRef } from 'react';
import { FormInput, isFlat, isShop, isOfficeOrShowroom } from './FormInputHelpers'; // Import the input component and helpers
import Image from 'next/image';



const Step1BasicInfo = ({ 
    getValue, 
    handleChange, 
    handleLandSizeChange,

    propTypeResidential,
    propTypeCommercial, 
    propTypeNewProject,
    propTypeLand,

    shopPlacementOptions,

    cityOptions,
    propertyCategories, 
    postingPurposeOptions, 
    facingOptions,
    handleFileChange,
    getArrayValue,
    handleRemoveImage          
}) => { 
    
    // Get the current state values needed for conditional rendering
    const propType = getValue('propertyType');
    const shopLocationType = getValue('shopLocationType');
    const propertyCategory = getValue('propertyCategory');
    const postingPurpose = getValue('postingPurpose');
    const fileInputRef = useRef(null);
    const selectedImages = getArrayValue('img');
    console.log(selectedImages)
    const fileButtonLabel = selectedImages.length > 0 
        ? `${selectedImages.length} images selected` 
        : 'Choose files (Max 10)';
    
    const PROPERTY_OPTIONS_MAP = {
        'Residential': propTypeResidential,
        'Commercial': propTypeCommercial,
        'New Project': propTypeNewProject,
        'Land': propTypeLand,
    };
    const propertyTypeOptions = PROPERTY_OPTIONS_MAP[propertyCategory] || [];

    return (
        <div className="form-step">
            <h3>1. Basic Property Information</h3>
            
            <div className="grid-2-col">
                <FormInput 
                    label="Posting Purpose" 
                    name="postingPurpose" 
                    type="select" 
                    options={postingPurposeOptions} 
                    getValue={getValue} 
                    handleChange={handleChange} 
                    handleFileChange={handleFileChange}
                />
                
                {postingPurpose === 'Lease' && (
                    <FormInput 
                        label="Min. Agreement Period (Months/Years)" 
                        name="minAgreementPeriod" 
                        getValue={getValue} 
                        handleChange={handleChange} 
                    />
                )}
            </div>
            
            <FormInput 
                label="Property Category" 
                name="propertyCategory" 
                type="select" 
                options={propertyCategories} 
                getValue={getValue} 
                handleChange={handleChange} 
            />
            {propertyTypeOptions.length > 0 && (
                <FormInput 
                    label={`Property Type (${propertyCategory})`} 
                    name="propertyType" 
                    type="select" 
                    options={propertyTypeOptions} 
                    getValue={getValue} 
                    handleChange={handleChange} 
                />
            )}


            {/* Conditional rendering for the rest of the fields based on required selections */}
            {postingPurpose && propertyCategory && propType && (
                <>
                    {/* Building Name / Colony Name (House/Flat) */}
                    {(propertyCategory !== 'Land' && propType !== 'Farmhouse')  && (
                        <FormInput 
                            label="Building Name/Colony Name/Street Name" 
                            name="buildingOrColonyName" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                        />
                    )}

                    {(isShop(propType) || isOfficeOrShowroom(propType)) && (
                        <FormInput 
                        label={`${propType} Location Type`}
                        name="shopLocationType" 
                        type="select" 
                        options={shopPlacementOptions} 
                        getValue={getValue} 
                        handleChange={handleChange} 
                        />
                    )}
                    
                    <FormInput 
                        label="Location" 
                        name="location" 
                        getValue={getValue} 
                        handleChange={handleChange} 
                    />
                    <FormInput 
                        label="Choose City" 
                        name="city" 
                        type="select" 
                        options={cityOptions} 
                        getValue={getValue} 
                        handleChange={handleChange} 
                    />
                    
                    {/* Floor Details (Flat specific) */}
                    {isFlat(propType) || shopLocationType === 'Retail Complex / Mall' ?
                        <div className="grid-2-col">
                            <FormInput 
                                label= {propType + ' Floor'} 
                                name="propertyFloor" 
                                type="number" 
                                getValue={getValue} 
                                handleChange={handleChange} 
                            />
                            <FormInput 
                                label="Total Floors in Building" 
                                name="totalFloors" 
                                type="number" 
                                getValue={getValue} 
                                handleChange={handleChange} 
                            />
                        </div>
                    :''}


                    { propertyCategory !== 'Land' ? 
                    <>
                    {(propType !== 'Residential Plot' && propType !== 'Commercial Plot') ? 
                    <>
                    <div className="grid-2-col">
                        <FormInput 
                            label="Carpet Area (in sqft)" 
                            name="carpetArea" 
                            type="number" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                        />
                        <FormInput 
                            label="Super Built-up Area (in sqft)" 
                            name="superBuiltUpArea" 
                            type="number" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                        />
                    </div>
                    
                    {(propType !== 'Flat' && shopLocationType !== 'In Retail Complex / Mall' && shopLocationType !== 'At Ground Floor of Building')? 
                    <div className="plot_detail_input">
                        <FormInput 
                            label="Plot Size (sqft)" 
                            name="plotSize" 
                            type="number" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                            className='plotsizeforminput'
                        />
                        <FormInput 
                            label="Width (in ft)" 
                            name="widthOfPlot" 
                            type="number" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                        />
                        <FormInput 
                            label="Length (in ft)" 
                            name="lengthOfPlot" 
                            type="number" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                        />
                    </div>
                    :''}

                    </>
                    :
                    <div className="plot_detail_input">
                        <FormInput 
                            label="Plot Size (sqft)" 
                            name="plotSize" 
                            type="number" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                            className='plotsizeforminput'
                        />
                        <FormInput 
                            label="Width (in ft)" 
                            name="widthOfPlot" 
                            type="number" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                        />
                        <FormInput 
                            label="Length (in ft)" 
                            name="lengthOfPlot" 
                            type="number" 
                            getValue={getValue} 
                            handleChange={handleChange} 
                        />
                    </div>
                    }
                    <FormInput 
                        label="Facing" 
                        name="facing" 
                        type="select" 
                        options={facingOptions} 
                        getValue={getValue} 
                        handleChange={handleChange} 
                    />
                    </>

                    : <FormInput 
                        label="Land Area" 
                        name="landAreaUnitDisplay" // Use the unit field name as the primary name for FormInput
                        type="land_area_combined" 
                        getValue={getValue}
                        handleChange={handleChange}
                        handleLandSizeChange={handleLandSizeChange} // Pass the conversion handler
                    />}

                    <FormInput 
                        label="Description" 
                        name="description" 
                        type="textarea" 
                        getValue={getValue} 
                        handleChange={handleChange} 
                    />
                    {/* --- Image Upload Section: Custom Input --- */}
                    <div className="form-group custom-file-upload-group">
                        <label htmlFor="img">Upload Property Images</label>
                        
                        {/* 2. Custom Button (Visible) */}
                        <button
                            type="button"
                            className="custom-file-button"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()} // Triggers the hidden input click
                        >
                            {fileButtonLabel}
                        </button>
                        
                        {/* 3. Native File Input (Hidden) */}
                        <input
                            ref={fileInputRef} // Attach the ref
                            type="file"
                            name="propertyImage"
                            id="img"
                            onChange={handleFileChange} 
                            required={false}
                            multiple // Enables multiple file selection
                            style={{ display: 'none' }} // Crucial: Hide the default UI
                        />
                    </div>

                    {/* --- Thumbnail Preview Section --- */}
                    {selectedImages.length > 0 && (
                        <div className="image-preview-container">
                            <h4>Image Previews ({selectedImages.length} selected)</h4>
                            <div className="thumbnails-grid">
                                {selectedImages.map((file, index) => (
                                    <div key={index} className="thumbnail-wrapper">
                                        <Image 
                                            src={file.preview} 
                                            alt={`Preview ${index + 1}`} 
                                            className="thumbnail-img"
                                            width={file.width? file.width : 100} 
                                            height={file.height? file.height : 100}
                                        />
                                        <p className="thumbnail-name">{file.name?.substring(0,15)}</p>

                                        {/* --- NEW: Removal Button --- */}
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => handleRemoveImage(file)} // Call new stable handler
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Step1BasicInfo;
