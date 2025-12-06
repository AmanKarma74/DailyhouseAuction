// Import Icons from existing libraries
import { LiaBedSolid, LiaDharmachakraSolid } from "react-icons/lia";
import { PiBathtub, PiCornersInDuotone, PiFlowerThin, PiElevatorLight, PiBuildingsDuotone, PiSwimmingPoolLight, PiParkLight, PiPipeDuotone, PiCoffeeDuotone, PiGameControllerDuotone, PiFireExtinguisherDuotone, PiFlowerLotusLight } from "react-icons/pi";
import { LuArmchair } from "react-icons/lu";
import { CiBank, CiShop, CiWifiOn } from "react-icons/ci";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { GiWaterRecycling, GiWaterTank, GiAutoRepair, GiMeditation, GiTennisRacket, GiRoad, GiTeePipe, GiBrickWall, GiGate } from "react-icons/gi";
import { CgGym } from "react-icons/cg";
import { RiParkingBoxLine, RiDeleteBin6Line } from "react-icons/ri";
import { GrUserPolice } from "react-icons/gr";
import { TbAirConditioning } from "react-icons/tb";
import { FcConferenceCall } from "react-icons/fc";
import { IoFlowerOutline, IoWaterOutline, IoBusOutline, IoCubeOutline, IoLocationOutline } from "react-icons/io5"; // Added IoLocationOutline
import { MdOutlineElectricalServices, MdOutlineSchool, MdOutlineLocationOn } from "react-icons/md";
import { FaTruck, FaUsers, FaRecycle, FaHome, FaSeedling, FaIndustry, FaWalking, FaBuilding, FaMapMarkerAlt, FaTree, FaStreetView } from "react-icons/fa"; // Added Font Awesome icons for land features

// Land-specific imports (Assuming Fa icons are available)
import { FaVectorSquare, FaWater, FaRoad, FaFaucet, FaBolt, FaDharmachakra, FaFireExtinguisher, FaRulerHorizontal, FaHardHat, FaSolarPanel, FaFileContract } from "react-icons/fa"; 
import { FaHospital, FaGasPump, FaTrain, FaSubway, FaShip, FaStore, FaTractor } from "react-icons/fa";

// default icon
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export const AmenityIconMap = {
    // Default Icon
    'DefaultIcon' : IoMdCheckmarkCircleOutline,
    
    // Utility & Essential Services (Existing)
    'HiOutlineLightBulb': HiOutlineLightBulb,
    'GiWaterRecycling': GiWaterRecycling,
    'GiWaterTank': GiWaterTank,
    'TbAirConditioning': TbAirConditioning,
    'PiPipeDuotone': PiPipeDuotone,
    'IoWaterOutline': IoWaterOutline,
    'MdOutlineElectricalServices': MdOutlineElectricalServices,
    'GiTeePipe': GiTeePipe,
    'PiFlowerThin': PiFlowerThin,
    
    // Community & Common Area (Existing)
    'PiBuildingsDuotone': PiBuildingsDuotone,
    'PiSwimmingPoolLight': PiSwimmingPoolLight,
    'CgGym': CgGym,
    'PiElevatorLight': PiElevatorLight,
    'PiParkLight': PiParkLight,
    'IoFlowerOutline': IoFlowerOutline,
    'PiGameControllerDuotone': PiGameControllerDuotone,
    'GiMeditation': GiMeditation,
    'GiTennisRacket': GiTennisRacket,
    'FcConferenceCall': FcConferenceCall,
    'PiCoffeeDuotone': PiCoffeeDuotone,

    // Safety, Security & Maintenance (Existing)
    'RiParkingBoxLine': RiParkingBoxLine,
    'GrUserPolice': GrUserPolice,
    'LiaDharmachakraSolid': LiaDharmachakraSolid, 
    'GiAutoRepair': GiAutoRepair, 
    'ImBin': RiDeleteBin6Line, 
    'PiFireExtinguisherDuotone': PiFireExtinguisherDuotone, 

    // Connectivity & Transport (Existing)
    'CiWifiOn': CiWifiOn, 
    'GiRoad': GiRoad, 
    'IoBusOutline': IoBusOutline,

    // Nearby/Local Landmarks (Existing)
    'CiBank': CiBank,
    'CiShop': CiShop, 
    'PiFlowerLotusLight': PiFlowerLotusLight, 
    'MdOutlineSchool': MdOutlineSchool,


    // Residential Land
    'GiGate': GiGate,
    'FaVectorSquare': FaVectorSquare, 
    'FaWater': FaWater,               
    'FaRoad': FaRoad,                 
    'FaFaucet': FaFaucet,             
    'FaBolt': FaBolt,                 
    'FaMapMarkerAlt': FaMapMarkerAlt, 
    'FaDharmachakra': FaDharmachakra, 
    'FaTree': FaTree,                 
    'FaStreetView': FaStreetView,     

    // Commercial Land
    'FaBuilding': FaBuilding,          
    'FaWalking': FaWalking,           
    'FaFileContract': FaFileContract, 
    'FaBus': IoBusOutline,            
    'FaIndustry': FaIndustry,        
    'FaParking': RiParkingBoxLine,     
    'FaRulerHorizontal': FaRulerHorizontal, 
    'FaFireExtinguisher': FaFireExtinguisher, 

    // Industrial Land
    'FaTruck': FaTruck,               
    'FaHardHat': FaHardHat,           
    'FaRecycle': FaRecycle,           
    'FaUsers': FaUsers,               
    
    // Agricultural Land
    'FaSeedling': FaSeedling,         
    'FaSolarPanel': FaSolarPanel,     
    'FaHome': FaHome,                 
    'FaMountain': IoCubeOutline,  
    
    // --- NEW NEAR BY ICONS ADDED ---
    'FaHospital': FaHospital,             
    'FaGasPump': FaGasPump,              
    'FaTrain': FaTrain,                   
    'FaSubway': FaSubway,                 
    'FaShip': FaShip,                      
    'FaStore': FaStore,                   
    'FaTractor': FaTractor,               
    'FaHome': FaHome,
};



//Icons For Basic Details
import { BiArea } from "react-icons/bi";

export const BasicDetailsIconMap = {
  bedroom: LiaBedSolid,
  bathroom: PiBathtub,
  furniture: LuArmchair,
  dimension: BiArea,
  construction: GiBrickWall,
  vastu: LiaDharmachakraSolid,
  garden: PiFlowerThin,
  nearby: MdOutlineLocationOn,
  surrounding: PiCornersInDuotone,
};