import { format } from 'date-fns';
import {
  IHoursProps,
  IAppointmentMaterialsProps,
} from '@modules/places/dtos/Appointments/ICreateAppointmentDTO';

export default (
  hours: IHoursProps[],
  materials: IAppointmentMaterialsProps[],
): string => {
  let emailText = 'Horários:<br/>';
  hours.map(item => {
    const date = `Data: ${format(new Date(item.start_date), 'dd/MM/yyyy')}`;
    const emailHours = `De: ${format(
      new Date(item.start_date),
      'HH:mm',
    )} às ${format(new Date(item.finish_date), 'HH:mm')}`;

    emailText += `<br/>${date}<br/>${item.court_name}<br/>${emailHours}<br/>Número de jogadores: ${item.number_of_players}<br/><br/>Materiais:<br/>`;

    if (materials && materials.length > 0) {
      const hourMaterials = materials.filter(
        material => material.id_hour === item.id,
      );

      hourMaterials.map(hourMaterial => {
        emailText += `${hourMaterial.material} - ${hourMaterial.amount}<br/>`;
        return null;
      });
    }

    emailText += '<br/>';
    return null;
  });

  return emailText;
};
