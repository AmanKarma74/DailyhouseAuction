// src/app/post-property/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";

import PostPropertyForm from '@/components/PropertyForm/PostPropertyForm';
import React from 'react';

const Page = async () => {

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect(`/auth?redirect_to=/post-property`);
  }
  if (!session?.user?.isApproved) {
    return redirect(`/onboarding`);
  }

  return (
    <PostPropertyForm initialData={{}} isEditMode={false} />
  );
};

export default Page;


