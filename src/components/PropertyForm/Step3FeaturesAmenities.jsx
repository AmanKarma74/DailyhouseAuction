import React from 'react';
import { FormInput, isShop, isFlat, isWarehouse, isResidential, isPlot, isLand, isOfficeOrShowroom } from './FormInputHelpers'; // Import the input component and helpers

const Step3FeaturesAmenities = ({ 
    getValue, 
    handleChange, 
    handleCheckboxChange, 
    getArrayValue, 
    furnishedOptions, 
    indoreWaterSourceOptions,
    constructionTypeOptions, 
    residentialAmenities,
    plotAmenities, 
    warehouseAmenities, 
    nearByOptions,
    landAmenities,
    landNearByOptions
}) => {
    
    // Get the current state values needed for conditional rendering
    const propertyType = getValue('propertyType');
    const propertyCategory = getValue('propertyCategory');
    
const currentAmenities = (propertyCategory, propertyType) => {
    const typeKey = propertyType ? propertyType.toLowerCase().replace(/\s/g, '') + 'Amenities' : '';

    if (propertyCategory === 'Land') {
        return landAmenities[typeKey] || [];
    } 
    else if (isPlot(propertyType)) {
        return plotAmenities; 
    } 
    else if (isWarehouse(propertyType) || isOfficeOrShowroom(propertyType)) {
        return warehouseAmenities;
    } 
    else {
        return residentialAmenities; 
    }
};
const currentNearByOptions = (propertyCategory, propertyType) => {
    if (propertyCategory === 'Land') {
        const typeKey = propertyType ? propertyType.toLowerCase().replace(/\s/g, '') + 'NearBy' : '';
        return landNearByOptions[typeKey] || [];
    } 
    else {
        return nearByOptions; 
    }
};

    return (
        <div className="form-step">
            <h3>3. Features and Amenities</h3>
            
            {/* 1. RESIDENTIAL DETAILS (House/Villa only) */}
            {(isResidential(propertyCategory, propertyType) && !isPlot(propertyType)) && (
                 <div className="grid-2-col amenities_page_grid-2-col">
                    <FormInput 
                        label="Water Supply" 
                        name="waterSource" 
                        type="select" 
                        options={indoreWaterSourceOptions} 
                        getValue={getValue} 
                        handleChange={handleChange} 
                        required
                    /> 
                    <FormInput 
                        label="Furnishing Status" 
                        name="furniture" 
                        type="select" 
                        options={furnishedOptions} 
                        getValue={getValue} 
                        handleChange={handleChange} 
                    />
                    <FormInput label="Total Bedrooms" name="totalBedrooms" type="number" getValue={getValue} handleChange={handleChange} />
                    <FormInput label="Total Bathrooms" name="bathroom" type="number" getValue={getValue} handleChange={handleChange} />
                    <FormInput label="Total Balconies" name="balcony" type="number" getValue={getValue} handleChange={handleChange} />
                    <FormInput label="Car Parking (e.g., 1 Covered)" name="carParking" getValue={getValue} handleChange={handleChange} />
                </div>
            )}
            
            {/* 2. COMMERCIAL/PLOT/FLAT DETAILS */}
            {(isShop(propertyType) || isFlat(propertyType) || isPlot(propertyType) || isWarehouse(propertyType) || isOfficeOrShowroom(propertyType)) && (
                 <div className="grid-2-col amenities_page_grid-2-col">

                    <FormInput 
                        label="Water Supply" 
                        name="waterSource" 
                        type="select" 
                        options={indoreWaterSourceOptions} 
                        getValue={getValue} 
                        handleChange={handleChange} 
                        required
                    /> 
                    
                    {/* Warehouse specific fields */}
                    {(isWarehouse(propertyType) || isOfficeOrShowroom(propertyType)) && (
                        <>
                            <FormInput 
                                label="Construction Type" 
                                name="constructionType" 
                                type="select" 
                                options={constructionTypeOptions} 
                                getValue={getValue} 
                                handleChange={handleChange} 
                            />
                            <FormInput label="Clear Height (m)" name="clearHeight" type="number" getValue={getValue} handleChange={handleChange} />
                            <FormInput label="Column Spacing (m)" name="columnSpacing" type="number" getValue={getValue} handleChange={handleChange} />
                        </>
                    )}
                    
                    {/* Furnishing for Flats/Residential */}
                    {(!isPlot(propertyType)) && (
                         <FormInput 
                            label="Furnishing Status" 
                            name="furniture" 
                            type="select" 
                            options={furnishedOptions} 
                            getValue={getValue} 
                            handleChange={handleChange} 
                        />
                    )}
                    
                    <FormInput label="Car Parking (e.g., 1 Covered)" name="carParking" getValue={getValue} handleChange={handleChange} />
                    

                </div>
            )}

            {/* AMENITIES SECTION (Dynamic List) */}
            <h4 className="amenities-heading">Select Amenities</h4>
            <div className="amenities-grid">
                {currentAmenities(propertyCategory,propertyType).map(amenity => (
                    <div key={amenity.name} className="amenity-item">
                        <input
                            type="checkbox"
                            id={amenity.name}
                            checked={ getArrayValue("amenities").some(item => item.name === amenity.name) }
                            onChange={() =>
                                handleCheckboxChange("amenities", {
                                    name: amenity.name,
                                    icon: amenity.icon
                                })
                            }
                        />

                        <label htmlFor={amenity.name}>{amenity.name}</label>
                    </div>
                ))}
            </div>
            
            {/* NEARBY SECTION (Common to all types) */}
            <h4 className="amenities-heading">Nearby Facilities</h4>
            <div className="amenities-grid">
                {currentNearByOptions(propertyCategory,propertyType).map(nearby => (
                    <div key={nearby.name} className="amenity-item">
                        <input
                            type="checkbox"
                            id={`nearby-${nearby.name}`}
                            checked={ getArrayValue("nearByPlaces").some(item => item.name === nearby.name) }
                            onChange={() =>
                                handleCheckboxChange("nearByPlaces", {
                                    name: nearby.name,
                                    icon: nearby.icon
                                })
                            }
                        />

                        <label htmlFor={`nearby-${nearby.name}`}>{nearby.name}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Step3FeaturesAmenities;