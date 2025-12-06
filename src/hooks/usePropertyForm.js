"use client"
import { useState, useEffect, useRef } from 'react';

// Default values for form fields
const initialFields = {
    postingPurpose: 'Sell',
    minAgreementPeriod: '',

    propertyCategory: '',
    propertyType: '',

    shopLocationType: '',
    buildingOrColonyName: '',
    location: '',
    city: 'Indore',

    propertyFloor: '',
    totalFloors: '',
    carpetArea: '',
    superBuiltUpArea: '',

    plotSize: '',
    widthOfPlot: '',
    lengthOfPlot: '',   // FIXED SPELLING

    facing: '',
    description: '',

    img: [],  
    price: 100000,

    developerName: '',
    transactionType: '',
    constructionYear: '',
    status: '',
    completionTime: '',

    permission: '',
    constructionArea: '',
    ReraId: '',

    // Land
    SQFT: '',
    Acre: '',
    Bigha: '',
    landAreaUnitDisplay: 'Acre',

    // House/Flat
    furniture: '',   // RENAMED furnished → furniture
    totalBedrooms: 1,
    bathroom: 1,
    balcony: '',
    carParking: '',
    waterSource: '',   // RENAMED waterSupply → waterSource

    propertySurrounding: '',
    constructionType: '',

    clearHeight: '',
    columnSpacing: '',

    amenities: [],
    nearByPlaces: [],  // RENAMED near_by → nearByPlaces
};

const CONVERSION_FACTORS = {
    'SQFT': 1,
    'Bigha': 27225, 
    'Acre': 43560,
};

export const usePropertyForm = (initialData = {}) => {

    if (initialData.completionTime) {
        initialData.completionTime = new Date(initialData.completionTime)
            .toISOString()
            .split("T")[0];
    }


    // Reformat old images → correct
    const processInitialImages = (images) => {
        if (!Array.isArray(images) || images.length === 0) return [];

        return images.map(img => {
            if (typeof img === "string") {
                return {
                    url: img,
                    preview: img,
                    name: img.split('/').pop(),
                    file: null
                };
            }

            if (img && typeof img === 'object' && img.url) {
                return {
                    ...img,
                    preview: img.url,
                    file: null
                };
            }

            return img;
        });
    };

    const [formData, setFormData] = useState(() => {
        const processedImages = processInitialImages(initialData.propertyImage || initialData.img || initialFields.img);
        return {
            ...initialFields,
            ...initialData,
            img: processedImages
        };
    });

    const activeFilesRef = useRef([]);

    // Auto adjustments remain same
    useEffect(() => {
        if (formData.propertyCategory === 'New Project' && formData.transactionType !== 'New Property') {
            setFormData(prev => ({ ...prev, transactionType: 'New Property' }));
        }
    }, [formData.propertyCategory]);

    useEffect(() => {
        const targetStatus = 'Under Construction';
        if (formData.propertyCategory === 'New Project' && formData.status !== targetStatus) {
            setFormData(prev => ({ ...prev, status: targetStatus }));
        }
    }, [formData.propertyCategory]);



    useEffect(() => {
        return () => {
            activeFilesRef.current.forEach(file => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
        };
    }, []);

    // General input handler
    const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
        const updated = {
            ...prev,
            [name]: value,
        };
        if (name === 'propertyCategory') {
            updated.propertyType = '';
        }

        return updated;
    });
};


    // Land conversion logic unchanged
    const handleLandSizeChange = (value, unit) => {
        const inputNumber = Number(value);
        if (value === '' || isNaN(inputNumber) || inputNumber <= 0) {
            setFormData(prev => ({
                ...prev,
                SQFT: '',
                Acre: '',
                Bigha: '',
                landAreaUnitDisplay: prev.landAreaUnitDisplay,
            }));
            return;
        }

        const factor = CONVERSION_FACTORS[unit];
        const baseSqFt = inputNumber * factor;

        let newValues = {};

        if (unit === 'SQFT') {
            newValues = {
                SQFT: value,
                Acre: (baseSqFt / CONVERSION_FACTORS['Acre']).toFixed(4),
                Bigha: (baseSqFt / CONVERSION_FACTORS['Bigha']).toFixed(4),
            };
        } else if (unit === 'Acre') {
            newValues = {
                Acre: value,
                SQFT: baseSqFt.toFixed(2),
                Bigha: (baseSqFt / CONVERSION_FACTORS['Bigha']).toFixed(4),
            };
        } else if (unit === 'Bigha') {
            newValues = {
                Bigha: value,
                SQFT: baseSqFt.toFixed(2),
                Acre: (baseSqFt / CONVERSION_FACTORS['Acre']).toFixed(4),
            };
        }

        setFormData(prev => ({
            ...prev,
            ...newValues,
            landAreaUnitDisplay: prev.landAreaUnitDisplay,
        }));
    };

    // File upload (unchanged)
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        setFormData(prev => {
            const currentFiles = prev.img;

            const currentFileObjects = currentFiles
                .map(item => item.file)
                .filter(f => f instanceof File);

            const uniqueNewFiles = newFiles.filter(newFile =>
                !currentFileObjects.some(f =>
                    f.name === newFile.name &&
                    f.size === newFile.size &&
                    f.lastModified === newFile.lastModified
                )
            );

            const prepared = uniqueNewFiles.map(file => ({
                file,
                name: file.name,
                preview: URL.createObjectURL(file),
                url: null
            }));

            const combined = [...currentFiles, ...prepared];
            activeFilesRef.current = combined;

            return { ...prev, img: combined };
        });

        e.target.value = "";
    };

    const handleRemoveImage = (fileToRemove) => {
        setFormData(prev => {
            const newImg = prev.img.filter(f => f !== fileToRemove);
            if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
            activeFilesRef.current = newImg;
            return { ...prev, img: newImg };
        });
    };

    const handleCheckboxChange = (name, newItem) => {
    setFormData(prev => {
        const current = prev[name] || [];

        const exists = current.some(item => item.name === newItem.name);

        const updated = exists
            ? current.filter(item => item.name !== newItem.name)
            : [...current, newItem];

        return { ...prev, [name]: updated };
    });
};


    const getValue = (name) => formData[name] ?? '';
    const getArrayValue = (name) => formData[name] || [];

    const getSubmissionData = () => formData;

    return {
        formData,
        handleChange,
        handleLandSizeChange,
        handleFileChange,
        handleRemoveImage,
        handleCheckboxChange,
        getValue,
        getArrayValue,
        getSubmissionData,
    };
};
