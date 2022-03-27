import React from 'react'

const Card = (props) => {
  return (
    <div className={`p-8 max-h-[500px] no-scrollbar overflow-y-scroll bg-white border border-gray-50 rounded-xl shadow-md ${props.className && props.className}`}>
      
        {props.children}
    </div>
  )
}

export default Card