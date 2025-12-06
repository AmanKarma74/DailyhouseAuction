// src/app/post-property/[listingid]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import PostPropertyForm from "@/components/PropertyForm/PostPropertyForm";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditPropertyPage({ params }) {
  const  listingid  = useParams().listingid;

  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "loading") return; // still checking session

    if (!session) {
      router.push(`/auth?redirect_to=/post-property/${listingid}`);
    }
    if (!session?.user?.isApproved) {
        return redirect(`/onboarding`);
      }
  }, [session, status, router, listingid]);

  

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${listingid}`);
        const data = await res.json();

        if (!data.success) {
          setInitialData(null);
        } else {
          // Convert backend data → shape expected by usePropertyForm
          const formatted = {
            ...data.property,
            img: Array.isArray(data.property.propertyImage)
              ? data.property.propertyImage.map((url) => ({
                  preview: url,
                  url: url,
                  name: url.split("/").pop(),
                  file: null,
                }))
              : [],
          };

          setInitialData(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setInitialData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [listingid]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading property...</div>;
  }

  if (!initialData) {
    return <h1 style={{ padding: "20px" }}>Property Not Found</h1>;
  }
  console.log(initialData)

  return (
    <PostPropertyForm 
      initialData={initialData}
      isEditMode={true}
    />
  );
}
