import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { BiCheck } from "react-icons/bi"

import { HiOutlineSelector } from "react-icons/hi";
import { cryptos } from '../constants/cryptos';
import Image from 'next/image';
import { useMoralis } from 'react-moralis';

export default function CryptoDropdown({ selected, setSelected }) {
//   const [selected, setSelected] = useState(cryptos[0])
  const [query, setQuery] = useState('')
  const { chainId } = useMoralis()
  
  // let cryptos[chainId] = [];
  // if(chainId == 0x13881){
  //   currencies = cryptos;
  // }else if(chainId == 0x3){
  //   currencies = cryptos_polygon;
  // }else {
  //   currencies = cryptos;
  // }
  console.log("Currencies", cryptos[chainId])
  const filteredcryptos =
    query === ''
      ? cryptos[chainId]
      : cryptos[chainId].filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className="w-64 top-16">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative z-30 mt-1">
        <div className="relative w-full text-left bg-white rounded-lg border cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-violet-300 focus-visible:ring-offset-2 sm:text-sm overflow-hidden flex items-center pl-2">
        <Image
                            alt={selected.name}
                          src={selected.icon}
                          width="30px"
                          height="30px"
                          objectFit='cover'
                          className="rounded-full ml-3 w-6 h-6 bg-white"
                        />
            <Combobox.Input
              className="w-full border-none focus:ring-0 right-0 py-2 pl-3 pr-10 text-sm leading-5 text-gray-600 font-semibold"
              displayValue={(selected) => selected.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <HiOutlineSelector
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredcryptos.length === 0 && query !== '' ? (
                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredcryptos.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                        active ? 'text-white bg-violet-600' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (

                      <div className="flex items-center space-x-2">
                        <Image
                            alt={person.name}
                          src={person.icon}
                          width="30px"
                          height="30px"
                          objectFit='cover'
                          className="rounded-full w-16 bg-white"
                        />
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`flex items-center ${
                              active ? "text-white" : "text-violet-600"
                            }`}
                          >
                            <BiCheck className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>

                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
