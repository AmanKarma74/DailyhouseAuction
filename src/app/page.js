export const dynamic = "force-dynamic";

// srch/app/page.js
import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./home.scss";

// Components
import Mainnavbar from "../components/Mainnavbar";
import PageSearch from "../components/PageSearch";
import LocalityCard from "../components/LocalityCard";
import TopBannerAd from "../components/TopBannerAdComponent";
import RecommendPropSection from "@/components/RecommendPropSection";
import AdCard from "../components/AdCard";
import CategoryCard from "../components/CategoryCard";

// Assets
import postPropertyBg2 from "../../public/assets/sell_property_background.svg";
import propertyGuideBanner from "../../public/assets/Property_Guide_Banner.png";

// -------------------------------
// 🔥 FETCH PROPERTIES SERVER-SIDE
// -------------------------------

export default async function Home() {
  // Fetch actual data from backend
  let handpicked = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties?limit=20`,
      {
        method: "GET",
        cache: "no-store", // SSR fetch (fresh every time)
      }
    );

    const data = await res.json();

    if (data?.success) {
      handpicked = data.properties.map((item) => ({
        ...item,
        img: Array.isArray(item.propertyImage)
          ? item.propertyImage.map((url) => ({
              url,
              preview: url,
              name: "property-image",
            }))
          : [],
      }));
    }
  } catch (err) {
    console.error("Home Page Property Fetch Error:", err);
  }


  return (
    <>
      <div className="mainnavbar_container_home">
        <Mainnavbar featureColor="#fff" postBgColor="white" />
      </div>

      <TopBannerAd />

      <section className="home_mid_content">
        <PageSearch />
        <AdCard />
      </section>

      {/* 🔥 Pass REAL backend data */}
      <RecommendPropSection cardData={handpicked} />

      <section className="appoint_advisor_section">
        <div className="advisor_div">
          <Image src={propertyGuideBanner} alt="Get Your Guide Now" />
        </div>
      </section>

      <section className="locality_agent_section">
        <LocalityCard />
      </section>

      <section className="categories">
        <CategoryCard />
      </section>

      <section className="sell_property_section">
        <div className="sell_image_container">
          <Image src={postPropertyBg2} alt="" />
        </div>

        <div className="sell_action_div">
          <h4>List your property and connect with clients faster!</h4>
          <Link href={"/post-property"}>
            <button>Sell your property</button>
          </Link>
        </div>
      </section>
    </>
  );
}

