"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePropertyForm } from '@/hooks/usePropertyForm'; 
import Link from 'next/link';
// Import memoized step components
import Step1BasicInfo from './Step1BasicInfo';
import Step2PricingStatus from './Step2PricingStatus';
import Step3FeaturesAmenities from './Step3FeaturesAmenities';
import '../../styles/postPropertyForm.scss'; // Ensure your styling is linked

// --- MOCK DATA AND OPTIONS (Defined here to be passed as stable props) ---
const postingPurposeOptions = ['Sell']; //, 'Rent', 'Lease' when we step into rental as well
const propertyCategories = ['Residential', 'Commercial', 'New Project', 'Land'];

const propTypeResidential = ['House', 'Flat', 'Residential Plot', 'Villa', 'Farmhouse'];
const propTypeCommercial = ['Shop', 'Warehouse', 'Commercial Plot', 'Godown', 'Showroom', 'Office Space'];
const propTypeNewProject = ['House', 'Flat', 'Villa', 'Farmhouse', 'Shop', 'Warehouse', 'Godown', 'Showroom', 'Office Space'];
const propTypeLand = ['Residential Land', 'Commercial Land', 'Industrial Land', 'Agricultural Land'];

const shopPlacementOptions = ['In Retail Complex / Mall', 'At Ground Floor of Building', 'On Independent Plot / Commercial Site', 'At Market / Commercial Street', ];

const cityOptions = ['Indore', 'Surat', 'Bhopal', 'Ujjain', 'Nagpur'];
const facingOptions = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];
const transactionOptions = ['New Property', 'Resale'];

const constructionTypeOptions = ['RCC', 'PEB', 'Metal'];
const statusOptionsHouseFlat = ['Ready to Move', 'Under Construction'];
const statusOptionsResale = ['Ready to Move', 'Under Construction', 'Under Renovation']; 
const statusOptionsShopWarehouse = ['Ready to Move', 'Under Construction', 'Under Renovation']; 
const furnishedOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
const propertySurroundingOptions = ['One Side Open', 'Corner Property', 'Three Side Open', 'Four Side Open']
const indoreWaterSourceOptions = ['Narmada Line', 'ESR Tank', 'Nagar Palika', 'Borewell', 'Not Available']

const nearByOptions = [{name: 'Bank & ATM', icon: 'CiBank'}, {name: 'Bus Stop', icon: 'IoBusOutline'}, {name: 'Market', icon: 'CiShop'}, {name: 'Temple', icon: 'PiFlowerLotusLight'}, {name: 'Gym', icon: 'CgGym'}, {name: 'School/College', icon: 'MdOutlineSchool'},];
const landNearByOptions = {
    residentiallandNearBy: [
        {name: 'School/College', icon: 'MdOutlineSchool'},
        {name: 'Market/Shopping Complex', icon: 'CiShop'},
        {name: 'Hospital/Clinic', icon: 'FaHospital'}, 
        {name: 'Bank & ATM', icon: 'CiBank'},
        {name: 'Bus Stop', icon: 'IoBusOutline'},
        {name: 'Park/Recreation Area', icon: 'PiParkLight'},
        {name: 'Petrol Pump', icon: 'FaGasPump'},
    ],

    // 2. Near By for 'Commercial Land'
    commerciallandNearBy: [
        {name: 'Public Transport Hub', icon: 'IoBusOutline'},
        {name: 'Major Market/Business District', icon: 'FaBuilding'},
        {name: 'National/State Highway Access', icon: 'GiRoad'},
        {name: 'Bank & ATM', icon: 'CiBank'},
        {name: 'Railway Station', icon: 'FaTrain'},
        {name: 'Metro Station', icon: 'FaSubway'},
        {name: 'Parking Facilities', icon: 'RiParkingBoxLine'},
    ],

    // 3. Near By for 'Industrial Land'
    industriallandNearBy: [
        {name: 'National/State Highway Access', icon: 'GiRoad'},
        {name: 'Railway Siding/Port', icon: 'FaShip'}, 
        {name: 'Labour Housing Area', icon: 'FaUsers'},
        {name: 'Industrial Banks', icon: 'CiBank'},
        {name: 'Fuel Depot/Petrol Pump', icon: 'FaGasPump'},
        {name: 'Police/Fire Station', icon: 'FaFireExtinguisher'},
    ],

    // 4. Near By for 'Agricultural Land'
    agriculturallandNearBy: [
        {name: 'Irrigation Canal/River', icon: 'GiWaterTank'},
        {name: 'Mandi (Agricultural Market)', icon: 'FaStore'}, 
        {name: 'Tractor Service Center', icon: 'FaTractor'},
        {name: 'Fertilizer/Seed Store', icon: 'FaSeedling'},
        {name: 'Farm Road Access', icon: 'GiRoad'},
        {name: 'Village/Settlement', icon: 'FaHome'},
    ],
};

const residentialAmenities = [
    {name: 'Garden Facing', icon: 'PiFlowerThin'},       
    {name: 'Power Back Up', icon: 'HiOutlineLightBulb'},       
    {name: 'Club House', icon: 'PiBuildingsDuotone'},    
    {name: 'Swimming Pool', icon: 'PiSwimmingPoolLight'},    
    {name: 'Gymnasium', icon: 'CgGym'},    
    {name: 'Lift', icon: 'PiElevatorLight'},    
    {name: 'Park', icon: 'PiParkLight'},    
    {name: 'Reserved Parking', icon: 'RiParkingBoxLine'},    
    {name: 'Security', icon: 'GrUserPolice'},    
    {name: 'Water Storage', icon: 'GiWaterTank'},    
    {name: 'Vaastu Compliant', icon: 'LiaDharmachakraSolid'},
    {name: 'Maintenance Staff', icon: 'GiAutoRepair'},
    {name: 'Waste Disposal', icon: 'ImBin'},
    {name: 'Internet/Wi-Fi Connectivity', icon: 'CiWifiOn'},
    {name: 'Piped Gas', icon: 'PiPipeDuotone'},
    {name: 'Indoor Games Room', icon: 'PiGameControllerDuotone'},
    {name: 'Meditation Area', icon: 'GiMeditation'},
    {name: 'Outdoor Tennis Courts', icon: 'GiTennisRacket'},
]
const plotAmenities = [   
    {name: 'Garden Facing', icon: 'PiFlowerThin'}, 
    {name: 'Park', icon: 'PiParkLight'},    
    {name: 'Reserved Parking', icon: 'RiParkingBoxLine'},    
    {name: 'Security', icon: 'GrUserPolice'},    
    {name: 'Borewell', icon: 'GiWaterTank'},    
    {name: 'Vaastu Compliant', icon: 'LiaDharmachakraSolid'},
    {name: 'Waste Disposal', icon: 'ImBin'},
    {name: 'Internet/Wi-Fi Connectivity', icon: 'CiWifiOn'},
    {name: 'Piped Gas', icon: 'PiPipeDuotone'},
    {name: 'Flower Gardens', icon: 'IoFlowerOutline'},
    {name: 'Indoor Games Room', icon: 'PiGameControllerDuotone'},
    {name: 'Outdoor Tennis Courts', icon: 'GiTennisRacket'},
]

const warehouseAmenities = [
            {name: 'Water Supply', icon: 'IoWaterOutline'},    
            {name: 'Electricity Supply (power load)', icon: 'MdOutlineElectricalServices'},   
            {name: 'Drainage/Sewage', icon: 'GiTeePipe'},    
            {name: 'Internet and Communication', icon: 'CiWifiOn'},    
            {name: 'Road Connectivity', icon: 'GiRoad'},    
            {name: 'Fire Safety System', icon: 'PiFireExtinguisherDuotone'},
        ]

const landAmenities = {
    residentiallandAmenities: [
        {name: 'Gated Society', icon: 'GiGate'},
        {name: 'Boundary Wall/Fencing', icon: 'FaVectorSquare'},
        {name: 'Drainage & Sewage System', icon: 'FaWater'},
        {name: 'Road Access (Paved/Tar)', icon: 'FaRoad'},
        {name: 'Water Supply (24/7)', icon: 'FaFaucet'},
        {name: 'Electricity Connection Ready', icon: 'FaBolt'},
        {name: 'Proximity to Schools/Hospitals', icon: 'FaMapMarkerAlt'},
        {name: 'Vaastu Compliant', icon: 'FaDharmachakra'},
        {name: 'Park/Green Space Nearby', icon: 'FaTree'},
        {name: 'Street Lights', icon: 'FaStreetView'},
    ],

    commerciallandAmenities: [
        {name: 'Frontage on Main Road', icon: 'FaBuilding'},
        {name: 'High Foot Traffic Area', icon: 'FaWalking'},
        {name: 'Approved for Commercial Use', icon: 'FaFileContract'},
        {name: 'Proximity to Public Transport Hub', icon: 'FaBus'},
        {name: 'High Power Load Provision', icon: 'FaIndustry'},
        {name: 'Reserved Customer Parking', icon: 'FaParking'},
        {name: 'Wide Road Access', icon: 'FaRulerHorizontal'},
        {name: 'Fire Safety Clearance', icon: 'FaFireExtinguisher'},
    ],

    industriallandAmenities: [
        {name: 'Approved for Industrial Use', icon: 'FaFileContract'},
        {name: 'Proximity to Highway/Port/Rail', icon: 'FaTruck'},
        {name: 'High Tension Power Line Access', icon: 'FaBolt'},
        {name: 'Heavy Vehicle Maneuvering Space', icon: 'FaParking'},
        {name: 'Water Supply for Industrial Use', icon: 'FaHardHat'},
        {name: 'Effluent Treatment Plant (ETP) space', icon: 'FaRecycle'},
        {name: 'Labour Colony/Housing nearby', icon: 'FaUsers'},
    ],

    agriculturallandAmenities: [
        {name: 'Fertile Soil', icon: 'FaMountain'},
        {name: 'Water Source (Borewell/Canal)', icon: 'FaWater'},
        {name: 'Fencing Available', icon: 'FaVectorSquare'},
        {name: 'Road Access (Farm/Kaccha Road)', icon: 'FaRoad'},
        {name: 'Electricity Access (Agricultural Use)', icon: 'FaSolarPanel'},
        {name: 'Farm House Permission', icon: 'FaHome'},
        {name: 'Clear Title/Agricultural Zoned', icon: 'FaFileContract'},
    ],
};




const PostPropertyForm = ({ initialData, isEditMode }) => {
    const router = useRouter();
    // 1. Hook Integration - Get stable state accessors and handlers
    const { 
        formData, 
        handleChange, 
        handleCheckboxChange, 
        handleLandSizeChange,
        getValue, 
        getArrayValue,
        handleFileChange,
        handleRemoveImage,
        getSubmissionData,
    } = usePropertyForm(initialData);
    
    const [currentStep, setCurrentStep] = useState(1);

    
    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Step navigation
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
            return;
        }

        const finalData = getSubmissionData();

        try {
            const fd = new FormData();

            // ---------------------------------------------------------
            // 1. PROCESS IMAGES (OLD + NEW)
            // ---------------------------------------------------------
            const existingImages = [];
            const newFiles = [];

            finalData.img.forEach(item => {
                if (item.file) {
                    // new uploaded image
                    newFiles.push(item.file);
                } else if (item.preview || item.url) {
                    // old image kept by user
                    existingImages.push(item.preview || item.url);
                }
            });

            // send old images to backend
            fd.append("existingImages", JSON.stringify(existingImages));

            // send NEW image files
            newFiles.forEach(file => {
                fd.append("propertyImage", file);
            });

            // ---------------------------------------------------------
            // 2. APPEND ALL REMAINING FIELDS (AUTO-HANDLING ARRAYS)
            // ---------------------------------------------------------
            Object.entries(finalData).forEach(([key, value]) => {

                // image key is already processed
                if (key === "img") return;

                // skip null/undefined
                if (value === null || value === undefined) return;

                // ******** ARRAY HANDLING (amenities, nearByPlaces, etc.) ********
                if (Array.isArray(value)) {
                    fd.append(key, JSON.stringify(value));
                    return;
                }

                // numbers -> convert to string
                if (typeof value === "number") {
                    fd.append(key, String(value));
                    return;
                }

                // everything else
                fd.append(key, value);
            });

            // force Sell
            fd.append("postingPurpose", "Sell");

            // ---------------------------------------------------------
            // 3. SELECT ENDPOINT
            // ---------------------------------------------------------
            const propertyId = initialData?._id || initialData?.id;

            const endpoint = isEditMode
                ? `/api/properties/${propertyId}`
                : `/api/properties/create`;

            const method = isEditMode ? "PUT" : "POST";

            // ---------------------------------------------------------
            // 4. SEND REQUEST
            // ---------------------------------------------------------
            const res = await fetch(endpoint, {
                method,
                body: fd
            });

            const result = await res.json();

            if (!result.success) {
                console.error("Property Save Error:", result.message);
                alert(result.message || "Failed to save property");
                return;
            }

            alert(`Property ${isEditMode ? "updated" : "posted"} successfully!`);
            router.push("/profile");

        } catch (err) {
            console.error("Submit Error:", err);
            alert("Something went wrong while uploading property.");
        }
    };


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    

    // 3. Render Helper for Step 2 (defined here as it relies on state accessors)
    const renderStatusOptions = () => {
        const propCategory = getValue('propertyCategory');
        const propType = getValue('propertyType');
        const transactionType = getValue('transactionType');

        if ((propCategory === 'Residential' && (propType !== 'Residential Plot' || propType !== 'Commercial Plot')) && transactionType === 'Resale') return statusOptionsResale;
        if ((propCategory === 'Residential' && (propType !== 'Residential Plot' || propType !== 'Commercial Plot')) || propCategory === 'New Project') return statusOptionsHouseFlat;
        if (propCategory === 'Commercial' && (propType !== 'Residential Plot' || propType !== 'Commercial Plot')) return statusOptionsShopWarehouse;
        return [];
    }
    
    // --- MAIN RENDER ---
    return (<>
        <Link href="/profile">
        <button 
            className="back-btn" 
            title="Go back to profile"
        >
            &larr; Back to Profile
        </button>
        </Link>
        <div className="post-property-wrapper">
            <div className="form-header-controls">
                <h2>{initialData ? 'Edit Property Listing' : 'Post New Property Listing'}</h2>
            </div>
            
            <div className="step-indicator">
                <span className={currentStep === 1 ? 'active' : ''}>Basic Info</span>
                <span className={currentStep === 2 ? 'active' : ''}>Pricing & Status</span>
                <span className={currentStep === 3 ? 'active' : ''}>Features & Amenities</span>
            </div>

            <form onSubmit={handleFormSubmit} className="property-form">
                
                {/* --- Step 1 Integration --- */}
                {currentStep === 1 && (
                    <Step1BasicInfo 
                        key="step-1"
                        getValue={getValue} 
                        handleChange={handleChange} 
                        handleFileChange={handleFileChange} // MUST be passed for file input
                        getArrayValue={getArrayValue}       // <--- FIX: Pass the function here!
                        handleRemoveImage={handleRemoveImage}
                        handleLandSizeChange={handleLandSizeChange}

                        // Passing mock data as stable props
                        propTypeResidential={propTypeResidential}
                        propTypeCommercial={propTypeCommercial}
                        propTypeNewProject={propTypeNewProject}
                        propTypeLand={propTypeLand}

                        shopPlacementOptions={shopPlacementOptions}
                        
                        cityOptions={cityOptions}
                        propertyCategories={propertyCategories}
                        postingPurposeOptions={postingPurposeOptions}
                        facingOptions={facingOptions}
                    />
                )}
                
                {/* --- Step 2 Integration --- */}
                {currentStep === 2 && (
                    <Step2PricingStatus 
                        key="step-2"
                        getValue={getValue} 
                        handleChange={handleChange}
                        // Passing helper function and mock data
                        renderStatusOptions={renderStatusOptions}
                        transactionOptions={transactionOptions}
                        propertySurroundingOptions={propertySurroundingOptions}
                    />
                )}
                
                {/* --- Step 3 Integration --- */}
                {currentStep === 3 && (
                    <Step3FeaturesAmenities 
                        key="step-3"
                        getValue={getValue} 
                        handleChange={handleChange}
                        handleCheckboxChange={handleCheckboxChange}
                        getArrayValue={getArrayValue}
                        // Passing mock data
                        furnishedOptions={furnishedOptions}
                        indoreWaterSourceOptions={indoreWaterSourceOptions}
                        constructionTypeOptions={constructionTypeOptions}
                        residentialAmenities={residentialAmenities}
                        plotAmenities={plotAmenities}
                        warehouseAmenities={warehouseAmenities}
                        nearByOptions={nearByOptions}
                        landAmenities={landAmenities}
                        landNearByOptions={landNearByOptions}
                    />
                )}

                <div className="form-navigation">
                    {currentStep > 1 && (
                        <button type="button" onClick={prevStep} className="nav-btn prev">
                            ← Back Step
                        </button>
                    )}
                    {currentStep < 3 && getValue('postingPurpose') && getValue('propertyCategory') && getValue('propertyType') && (
                        <button type="submit" className="nav-btn next" >
                            Next Step →
                        </button>
                    )}
                    {currentStep === 3 && (
                        <button type="submit" className="submit-btn">
                            {isEditMode ? 'Save Changes' : 'Publish Property'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    </>);
};

export default PostPropertyForm;