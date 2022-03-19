import Image from "next/image";
import React from "react";

const ListItem = (props) => {
  return (
    <div className={`flex space-x-3 py-2 justify-between border-b items-center border-gray-50 ${props.className ? props.className : ''}`}>
    <div className="flex space-x-3 items-center">

    {
        props.image ?
        <Image alt={props.title} objectFit="contain" width={'30px'} src={props.image} className={`rounded-full w-8 h-8 max-h-8`}/> : null
    }
        <div className="flex flex-col">
        <span className="font-medium text-sm text-gray-700">{props.title}</span>
        <span className="font-medium tracking-wider text-xs text-gray-500">{props.subTitle}</span>
        </div>
    </div>
        {
            props.left ? props.left : null
        }
    </div>
  );
};

export default ListItem;
