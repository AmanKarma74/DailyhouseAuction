import React from 'react'
import AuthPage from '@/components/Auth/AuthPage'

async function page({searchParams}) {
    const redirectTo = (await searchParams).redirect || "/";
  return (
    <AuthPage redirectTo={redirectTo} />
  )
}

export default page