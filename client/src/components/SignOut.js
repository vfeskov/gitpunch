import React from 'react'

export default function SignOut ({ className, email, signOut }) {
  function onClick (e) {
    e.preventDefault();
    signOut();
  }
  return email && (
    <div className={className}>
      <span style={{display: 'inline-block', paddingRight: '1em'}}>{email}</span>
      <a href="" onClick={onClick}>Sign Out</a>
    </div>
  )
}
