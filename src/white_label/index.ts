import ProjectProps from './dtos/ProjectProps';
import Ahaya from './Ahaya';
import Jardins from './Jardins';
import Calango from './Calango';
import BelaVista from './BelaVista';

export default (): ProjectProps => {
  switch (String(process.env.CLIENT)) {
    case 'Ahaya':
      return Ahaya;
    case 'Jardins':
      return Jardins;
    case 'Calango':
      return Calango;
    case 'BelaVista':
      return BelaVista;
    default:
      return BelaVista;
  }
};
