import React from 'react'

const Grid = (props) => {
  return (
    <div className={`grid grid-cols-1 mb-4 md:grid-cols-${props.cols} gap-4 ${props.className && props.className}`}>
        
        {props.children}

    </div>
  )
}

export default Grid