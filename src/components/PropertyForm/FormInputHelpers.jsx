import React from 'react';

// --- Helper Functions (Exported for use in Step components) ---

export const isFlat = (propType) => propType && propType.toLowerCase().includes('flat');
export const isShop = (propType) => propType === 'Shop';
export const isWarehouse = (propType) => propType === 'Warehouse';
export const isOfficeOrShowroom = (propType) => (propType === 'Office Space' || propType === 'Godown' || propType === 'Showroom')
export const isPlot = (propType) => (propType === 'Residential Plot' || propType === 'Commercial Plot')
export const isResidential = (category, type) => (category === 'Residential' || category === 'New Project') && !isFlat(type) && type !== ''; 
export const isLand = (category) => category === 'Land';


const landUnits = ['SQFT', 'Acre', 'Bigha'];

const MemoLandInput = ({ label, areaName, unitName, sizeValue, unitValue, handleLandSizeChange, handleChange }) => {
    
    // Handler for the text input (number change)
    const handleValueChange = (e) => {
        const value = e.target.value;
        // Call the custom handler, passing the value and the currently selected unit
        handleLandSizeChange(value, unitValue);
    };

    // Handler for the select input (unit change)
    const handleUnitChange = (e) => {
        const newUnit = e.target.value;
        // 1. Update the unit display state (using general handleChange)
        handleChange(e); 
        handleLandSizeChange(sizeValue, newUnit);
    };


    return (
        <div className="form-group land-area-group">
            <label htmlFor={areaName}>{label}</label>
            <div className="input-group-split">
                {/* Input for the Numeric Area Value */}
                <input
                    type="number"
                    name={areaName}
                    id={areaName}
                    value={sizeValue}
                    onChange={handleValueChange} 
                    placeholder={`Enter area in ${unitValue}`}
                    required
                />
                {/* Select for the Unit of Measure */}
                <select 
                    name={unitName}
                    id={unitName}
                    value={unitValue} 
                    onChange={handleUnitChange} 
                    required
                >
                    {landUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};


export const FormInput = ({ label, name, type = 'text', options, required = true, rows, placeholder, getValue, handleChange, handleLandSizeChange }) => {
    
    const value = getValue(name);
    const key = name; 


    if (type === 'land_area_combined') {
        
        const unitValue = getValue('landAreaUnitDisplay');
        
        // Find the current value stored in the state based on the selected unit
        // This is necessary to show the user's input after they switch units.
        
        const currentSizeValue = getValue(unitValue);

        return (
            <MemoLandInput 
                label={label} 
                areaName="landAreaUnitDisplay" // Passing the name of the UI unit field
                unitName="landAreaUnitDisplay"
                sizeValue={currentSizeValue}
                unitValue={unitValue}
                handleLandSizeChange={handleLandSizeChange}
                handleChange={handleChange} 
            />
        );
    };
    // File input is now handled directly in Step1BasicInfo.jsx
    if (type === 'file') {
        // Return null or throw error if called, though the parent should no longer call it for type="file"
        return null; 
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            {type === 'select' ? (
                <select 
                    key={key} 
                    name={name} 
                    id={name} 
                    value={value} 
                    onChange={handleChange} 
                    required={required}
                >
                    <option value="" disabled>Select {label}</option>
                    {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                 <textarea 
                    key={key}
                    name={name} 
                    id={name} 
                    rows={rows || 4} 
                    value={value} 
                    onChange={handleChange} 
                    placeholder={placeholder || `Enter property ${name}...`}
                    required={required} 
                />
            ) : (
                <input
                    key={key}
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder || `Enter ${label}`}
                    required={required}
                />
            )}
        </div>
    );
};
