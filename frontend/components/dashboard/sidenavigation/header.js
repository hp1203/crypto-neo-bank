import { FaEthereum } from "react-icons/fa";

export default function SidenavHeader() {
  return (
    <div className="bg-violet-500  flex h-20 items-center justify-center mb-6 sticky top-0 z-10">
      <a className="flex flex-col title-font font-medium items-center justify-center text-white">
          {/* <Image src={require("../public/logo.jpg")} alt="Cryptoneo"/> */}
          <FaEthereum className="bg-white text-3xl w-8 h-8 p-2 text-violet-500 rounded-full mb-1" />
          <span className="text-sm font-mono font-bold">Cryptoneo</span>
        </a>
    </div>
  );
}
