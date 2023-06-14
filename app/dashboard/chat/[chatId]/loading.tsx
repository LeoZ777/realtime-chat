import React from 'react'

export default async function loading() {
    await new Promise(resolve => setTimeout(resolve, 1000))
  return (
    <div>Loading...</div>
  )
}
