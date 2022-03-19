import Overlay from './provider/overlay';
import TopNavigation from './topnavigation';
import SideNavigation from './sidenavigation';
import DashboardProvider from './provider/context';

const style = {
  container: `bg-gray-100 h-screen overflow-hidden relative`,
  main: `h-screen overflow-auto pb-36 pt-4 px-4 md:pb-8 lg:px-8`,
  mainContainer: `flex flex-col h-screen pl-0 w-full lg:pl-24 lg:space-y-4`,
};

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <div className={style.container}>
        <div className="flex items-start">
          <Overlay />
          <SideNavigation mobilePosition="right" />
          <div className={style.mainContainer}>
            <TopNavigation />
            <main className={style.main}>
            <div className='max-w-7xl mx-auto'>{children}</div>
            </main>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
