import HomeIcon from './icons/home';
import BillsIcon from './icons/bills';
import AnalyticsIcon from './icons/analytics';
import MonitoringIcon from './icons/monitoring';
import DemographicsIcon from './icons/demographics';
import ApplicationsIcon from './icons/applications';
import DocumentationIcon from './icons/documentation';

const data = [
  {
    title: 'Dashboard',
    icon: <HomeIcon />,
    link: '/',
  },
  {
    title: 'Payments',
    icon: <BillsIcon />,
    link: '/admin/bills',
  },
  {
    title: 'Transactions',
    icon: <ApplicationsIcon />,
    link: '/admin/applications',
  },
  {
    title: 'Investment',
    icon: <MonitoringIcon />,
    link: '/admin/monitoring',
  },
  {
    title: 'Contacts',
    icon: <DemographicsIcon />,
    link: '/admin/demographics',
  },
  {
    title: 'Analytics',
    icon: <AnalyticsIcon />,
    link: '/admin/analytics',
  },
  {
    title: 'Documentation',
    icon: <DocumentationIcon />,
    link: '/admin/documentation',
  },
];

export default data;
