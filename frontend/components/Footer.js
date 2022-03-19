import React from 'react'
import { FaDiscord, FaEthereum, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font border-t border-gray-100 ">
  <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
  <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          {/* <Image src={require("../public/logo.jpg")} alt="Cryptoneo"/> */}
          <FaEthereum className="bg-violet-500 text-3xl w-10 h-10 p-2 text-white rounded-full" />
          <i className="border-r border-gray-300 h-10 ml-3"></i>
          <span className="ml-3 text-2xl font-mono font-bold">Cryptoneo</span>
        </a>
    <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© {new Date().getFullYear()} Cryptoneo. All rights reserved.
    </p>
    <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
      <a className="text-gray-500">
        <FaFacebook className="w-5 h-5"/>
      </a>
      <a className="ml-3 text-gray-500">
        <FaTwitter className="w-5 h-5"/>
      </a>
      <a className="ml-3 text-gray-500">
        <AiFillInstagram className="w-5 h-5"/>
      </a>
      <a className="ml-3 text-gray-500">
        <FaLinkedin className="w-5 h-5"/>
      </a>
      <a className="ml-3 text-gray-500">
        <FaDiscord className="w-5 h-5"/>
      </a>
    </span>
  </div>
</footer>
  )
}

export default Footer