import React from 'react'
import {Link} from 'react-router-dom'

export default function Otherpage() {
  return (
    <div>
        Im some other page!
        <Link to="/">Go back home</Link>
    </div>
  )
}