import React from 'react'

const PageHeader = (props) => {
  return (
    <div className='flex justify-between items-center pt-2 pb-6'>
        <h1 className="text-2xl font-semibold">{props.title}</h1>
        <div className="flex items-center space-x-2">
        {props.children}
        </div>
    </div>
  )
}

export default PageHeader