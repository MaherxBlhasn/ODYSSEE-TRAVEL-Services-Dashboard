import React, { Suspense } from 'react'
import ResetPasswordClient from './resetPasswordClient'

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading reset form...</div>}>
      <ResetPasswordClient />
    </Suspense>
  )
}

export default ResetPasswordPage