// src/app/profile/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Property from "@/models/Property";

import Mainnavbar from "@/components/Mainnavbar";
import ProfileDetailsClient from "@/components/ProfileDetailsClient";
import ProfileListingSectionClient from "@/components/ProfileListingSectionClient";

export default async function ProfilePage() {
  // -------------------------------------------------------
  // 1️⃣ AUTH CHECK
  // -------------------------------------------------------
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect(`/auth?redirect_to=/profile`);
  }

  const userId = session.user.id;

  // -------------------------------------------------------
  // 2️⃣ CONNECT DB & FETCH USER
  // -------------------------------------------------------
  await dbConnect();

  const user = await User.findById(userId)
    .lean()
    .select("-password");

  if (!user) {
    return (
      <h2 style={{ padding: "40px", textAlign: "center", color: "red" }}>
        User not found.
      </h2>
    );
  }

  // Convert User fields safely
  user._id = user._id.toString();
  user.likedProperties = (user.likedProperties || []).map((id) =>
    id.toString()
  );
  user.propertiesListed = (user.propertiesListed || []).map((id) =>
    id.toString()
  );
  user.createdAt = user.createdAt?.toString();
  user.updatedAt = user.updatedAt?.toString();

  // -------------------------------------------------------
  // 3️⃣ FETCH USER LISTINGS (using propertiesListed)
  // -------------------------------------------------------
  const listingsRaw = await Property.find({
    _id: { $in: user.propertiesListed },
  })
    .sort({ createdAt: -1 })
    .lean();

  // -------------------------------------------------------
  // 4️⃣ FETCH USER LIKED PROPERTIES
  // -------------------------------------------------------
  const likedRaw = await Property.find({
    _id: { $in: user.likedProperties },
  })
    .sort({ createdAt: -1 })
    .lean();

  // -------------------------------------------------------
  // 5️⃣ NORMALIZE PROPERTY OBJECTS
  // -------------------------------------------------------
  const normalizeProperty = (p) => ({
    ...p,
    _id: p._id.toString(),
    listedBy: p.listedBy?.toString(),

    createdAt: p.createdAt?.toString(),
    updatedAt: p.updatedAt?.toString(),

    // Convert image URLs correctly
    img: Array.isArray(p.propertyImage)
      ? p.propertyImage.map((url) => ({
          url,
          preview: url,
          name: "property-image",
        }))
      : [],

    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    nearByPlaces: Array.isArray(p.nearByPlaces) ? p.nearByPlaces : [],
  });

  const listings = listingsRaw.map(normalizeProperty);
  const likedProperties = likedRaw.map(normalizeProperty);

  // -------------------------------------------------------
  // 6️⃣ CHECK POSTING PERMISSION
  // -------------------------------------------------------
  const canListProperties = user.isApproved && user.onboarded;

  // -------------------------------------------------------
  // 7️⃣ RENDER PAGE
  // -------------------------------------------------------
  return (
    <>
      <div className="mainnavbar_container_profile">
        <Mainnavbar featureColor="#303030" postBgColor="#FFC72C" />
      </div>

      <div className="profile-page">
        {/* Profile Box */}
        <ProfileDetailsClient userData={user} profileid={userId} />

        {/* User Listings */}
        {canListProperties && (
          <ProfileListingSectionClient
            title="Your Listings"
            listings={listings}
            profileid={userId}
            isEditable={true}
            isListingSection={true}
          />
        )}

        {/* Favourite Properties */}
        <ProfileListingSectionClient
          title="Your Favourite"
          listings={likedProperties}
          profileid={userId}
          isEditable={false}
          isListingSection={false}
        />
      </div>
    </>
  );
}
