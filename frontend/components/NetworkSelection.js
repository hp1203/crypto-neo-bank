import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
// import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { networks } from "../constants/networks";
import Image from 'next/image';
import { BiCheck } from 'react-icons/bi';
import { HiOutlineSelector } from 'react-icons/hi';

export default function NetworkSelection() {
  const [selected, setSelected] = useState(networks[0])

  return (
    <div className="top-16 min-w-[200px]">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="relative flex items-center space-x-2 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg border border-gray-100  cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
          <Image
                            alt={selected.chainName}
                          src={selected.icon}
                          width="30px"
                          height="30px"
                          objectFit='cover'
                          className="rounded-full ml-3 w-6 h-6 bg-white"
                        />
            <span className="block truncate">{selected.chainName}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <HiOutlineSelector
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {networks.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <div className="flex items-center space-x-2">
                        <Image
                            alt={person.chainName}
                          src={person.icon}
                          width="30px"
                          height="30px"
                          objectFit='cover'
                          className="rounded-full w-16 bg-white"
                        />
                       <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {person.chainName}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-violet-600">
                          <BiCheck className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                      </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
