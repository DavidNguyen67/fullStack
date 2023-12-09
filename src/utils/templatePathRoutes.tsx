import ScheduleIcon from '@mui/icons-material/Schedule';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Home from '../components/home/Home';
interface pathElementObject {
  path: string;
  icon?: any;
  variant?: string;
  marginLeft?: string;
  components?: any;
}

export const pathElements: pathElementObject[] = [
  {
    path: 'atHome',
  },
  {
    path: 'atHospital',
  },
  {
    path: 'healthyLife',
  },
  {
    path: 'schedule',
    icon: <ScheduleIcon />,
    // variant: '#0288d1',
    marginLeft: 'auto',
  },
  {
    path: 'support',
    icon: <SupportAgentIcon />,
    // variant: '#0288d1',
  },
];
export const pathDropDownElements: pathElementObject[] = [
  {
    path: 'home',
    components: <Home />,
  },
  {
    path: 'handbook',
    components: <Home />,
  },
  {
    path: 'cooperation',
    components: <Home />,
  },
  {
    path: 'corporateHealth',
    components: <Home />,
  },
  {
    path: 'recruitment',
    components: <Home />,
  },
  {
    path: 'aboutUs',
    components: <Home />,
  },
  {
    path: 'forPatient',
    components: <Home />,
  },
  {
    path: 'forDoctor',
    components: <Home />,
  },
];
