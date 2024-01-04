import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import React from 'react'

const Custom404 = () => {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4 text-center">
      <div className="mb-10">
        <img
          src={`${STATIC_ASSETS}/images/illustrations/404.gif`}
          draggable={false}
          height={200}
          width={200}
          alt={TAPE_APP_NAME}
        />
      </div>
      <h1 className="text-4xl font-bold">404</h1>
      <div className="mb-6">This publication could not be found.</div>
    </div>
  )
}

export default Custom404
