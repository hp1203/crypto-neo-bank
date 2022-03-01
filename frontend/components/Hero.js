import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <section className="text-gray-600 body-font">
  <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center lg:max-w-2xl">
      <h1 className="title-font md:text-8xl text-3xl mb-4 font-medium text-gray-900">The Future of  
        <br className="hidden lg:inline-block"/><span className="text-violet-500">Defi</span> is Here
      </h1>
      <p className="mb-8 leading-relaxed">Cryptoneo is a neobank for the your cryptos. It comes with a smart, zero balance savings account and features that help you get better with your cryptos.</p>
      <div className="flex justify-center">
        <button className="inline-flex text-white bg-violet-500 border-0 py-2 px-6 focus:outline-none hover:bg-violet-600 text-lg rounded-lg">Get Started</button>
      </div>
    </div>
    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
      <Image className="object-cover object-center" alt="hero" src={require("../public/11124.jpg")}/>
    </div>
  </div>
</section>
  )
}

export default Hero