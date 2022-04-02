import { BiMenu } from 'react-icons/bi';
import { useToggle } from '../provider/context';
import ProfileDropdown from "../../ProfileDropdown";
import Account from '../../Account';
import NetworkSelection from '../../NetworkSelection';
export default function TopNavigation() {
  const { toggle } = useToggle();
  return (
    <header className="bg-white h-16 items-center relative shadow w-full z-10 md:h-20">
      <div className="flex flex-center flex-col h-full justify-center mx-auto px-3 relative">
        <div className="flex items-center pl-1 relative w-full sm:ml-0 sm:pr-2 lg:max-w-68">
          <div className="flex left-0 relative w-3/4">
            <div className="flex group h-full items-center relative w-12">
              <button
                type="button"
                aria-expanded="false"
                aria-label="Toggle sidenav"
                onClick={toggle}
                className="text-4xl text-violet-500 focus:outline-none"
              >
                <BiMenu/> 
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-end ml-5 p-1 relative w-full sm:mr-0 sm:right-auto">
            {/* <NetworkSelection/> */}
            <Account/>
          </div>
        </div>
      </div>
    </header>
  );
}
