import React from 'react';
import { FormInput } from './FormInputHelpers'; // Import the input component

const Step2PricingStatus = ({ 
    getValue, 
    handleChange, 
    renderStatusOptions, // Function passed from PropertyForm.jsx
    transactionOptions,
    propertySurroundingOptions
}) => {
    
    // Get the current state values needed for conditional rendering
    const propertyCategory = getValue('propertyCategory');
    const propType = getValue('propertyType')
    const transactionType = getValue('transactionType');
    const status = getValue('status');
    const price = getValue('price');
    

    const builderNameInputVisibleFor = ['House', 'Flat', 'Villa', 'Farmhouse'];

    const formatIndianPrice = (price) => {
            if (typeof price !== 'number' || isNaN(price) || price < 0) {
                return '₹ 0';
            }

            // --- Conversion Factors ---
            const THOUSAND = 1000;
            const LAKH = 100000;
            const CR = 10000000;

            let formattedPrice;

            if (price >= CR) {
                const value = price / CR;
                formattedPrice = `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
            } else if (price >= LAKH) {
                const value = price / LAKH;
                formattedPrice = `${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakh`;
            } else if (price >= THOUSAND) {
                const value = price / THOUSAND;
                formattedPrice = `${value.toLocaleString('en-IN', { maximumFractionDigits: 1 })} K`;
            } else {
                return `₹ ${price.toLocaleString('en-IN')}`;
            }
            return `₹ ${formattedPrice}`;
        };

    const priceOfProperty = formatIndianPrice (Number(price)) ;

    return (
        <div className="form-step">
            <h3>2. Pricing and Status Details</h3>
            
            <FormInput 
                label="Total Price '₹'" 
                name="price" 
                type='number'
                getValue={getValue} 
                handleChange={handleChange} 
                required
            />
            {(price >= 1000) && (<span className='price_preview'>{priceOfProperty}</span>)}
            

            {(builderNameInputVisibleFor.includes(propType)) && (
                <FormInput 
                    label="Developer/Builder Name (Optional)" 
                    name="developerName" 
                    required={false} 
                    getValue={getValue} 
                    handleChange={handleChange} 
                />
            )}

            {((propertyCategory === 'Residential' || propertyCategory === 'Commercial') && (propType !== 'Residential Plot' && propType !== 'Commercial Plot')) && (
                <FormInput 
                    label="Transaction Type" 
                    name="transactionType" 
                    type="select" 
                    options={transactionOptions} 
                    getValue={getValue} 
                    handleChange={handleChange} 
                />
            )}

            {(transactionType === 'Resale' && (propertyCategory === 'Residential' || propertyCategory === 'Commercial') && (propType !== 'Residential Plot' || propType !== 'Commercial Plot')) && (
                <FormInput 
                    label="Construction Year" 
                    name="constructionYear" 
                    type="number" 
                    getValue={getValue} 
                    handleChange={handleChange} 
                />
            )}
            {((propType !== 'Residential Plot' && propType !== 'Commercial Plot') && propertyCategory !== 'Land') && (
            <FormInput 
                label="Property Status" 
                name="status" 
                type="select" 
                // Call the prop function to get the correct status options based on current state
                options={renderStatusOptions()} 
                getValue={getValue} 
                handleChange={handleChange} 
            />
            )}

            {(status === 'Under Construction' || status === 'Under Renovation') && (
                <FormInput 
                    label="Completion Time/Possession (e.g., Dec'25)" 
                    name="completionTime" 
                    type='date'
                    getValue={getValue} 
                    handleChange={handleChange} 
                />
            )}

            {propertyCategory === 'Commercial' && propType === 'Commercial Plot' && (
                <FormInput 
                    label="Permission (e.g., Tinshed, Building)" 
                    name="permission" 
                    getValue={getValue} 
                    handleChange={handleChange} 
                />
            )}
            {propertyCategory === 'Land' && propType !== 'Residential Land' && propType !== 'Agricultural Land' && (
                <FormInput 
                    label="Permission (e.g., Warehouse, Building)" 
                    name="permission" 
                    getValue={getValue} 
                    handleChange={handleChange} 
                />
            )}
            
            {(propertyCategory === 'Commercial' && propType !== 'Commercial Plot') && (
                <FormInput 
                    label="Construction Area" 
                    name="constructionArea" 
                    getValue={getValue} 
                    handleChange={handleChange} 
                />
            )}

            {(propType !== 'Flat' && propType !== 'Agricultural Land') && (
            <FormInput 
                label="Property Surrounding" 
                name="propertySurrounding" 
                type="select" 
                options={propertySurroundingOptions} 
                getValue={getValue} 
                handleChange={handleChange} 
                required
            />
            )}

            <FormInput 
                label="RERA ID (Optional)" 
                name="ReraId" 
                required={false} 
                getValue={getValue} 
                handleChange={handleChange} 
            />
        </div>
    );
};

export default Step2PricingStatus;