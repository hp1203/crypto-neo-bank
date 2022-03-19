import React from "react";

const ImageInput = (props) => {
  return (
    // <input {...props} className={`px-4 flex space-x-2 text-sm duration-150 font-medium py-2 items-center rounded-xl ${ props.primary ? 'bg-violet-500 hover:bg-violet-600 border-violet-700' : 'bg-gray-200 border-gray-300 hover:bg-gray-300' } ${ props.primary ? 'text-white' : 'text-gray-600' }`}>
    //     {props.leftIcon && props.leftIcon }
    //     {props.title}
    //     {props.rightIcon && props.rightIcon }
    // </input>
    <div className="flex space-x-2 items-center mb-2  bg-gray-50 rounded-lg p-2">
    {
        props.preview && 
        <img src={props.previewSrc ? props.previewSrc : "https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-7.jpg"} className={` object-cover ${props.previewClassName && props.previewClassName}`}/>
    }
    <div className="flex flex-col space-y-1">
      {props.label && (
        <label className="font-medium text-gray-600">{props.label}</label>
      )}
      <input
      type="file"
      accept="image/*"
        {...props}
        className={`border-gray-100 focus:ring-1 focus-visible:ring-violet-500 ${
          props.className && props.className
        }`}
      />
    </div>
    </div>
  );
};

export default ImageInput;
