import React from 'react'
import { BiLoaderAlt } from 'react-icons/bi'

const Button = (props) => {
  return (
    <button {...props} className={`px-4 flex space-x-2 text-sm duration-150 font-medium py-2 items-center rounded-xl ${ props.primary ? 'bg-violet-500 hover:bg-violet-600 border-violet-700' : 'bg-gray-200 border-gray-300 hover:bg-gray-300' } ${ props.primary ? 'text-white' : 'text-gray-600' } ${props.className && props.className}`}>
        {props.leftIcon && !props.loading && props.leftIcon }
        {props.loading && <BiLoaderAlt className="text-sm animate-spin mr-1"/> }
        {props.title}
        {props.rightIcon && props.rightIcon }
    </button>
  )
}

export default Button