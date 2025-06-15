import { format } from 'date-fns';
import {
  IHoursProps,
  IAppointmentProps,
  IAppointmentMaterialsProps,
} from '@modules/places/dtos/Appointments/ICreateAppointmentDTO';
import WhatsAppNotification from '@modules/places/providers/WhatsAppNotification';
import SpecificsNotification from '@modules/places/providers/SpecificsNotification';
import User from '@modules/users/infra/typeorm/entities/User';
import Place from '@modules/places/infra/typeorm/entities/Places/Place';
import axios from 'axios';
import white_label from '../../../../../white_label';

export default (
  adminUsers: User[],
  hours: IHoursProps[],
  appointment: IAppointmentProps,
  materials: IAppointmentMaterialsProps[],
  place: Place,
): void => {
  const start_date = `Início: ${format(
    new Date(hours[0].start_date),
    'dd/MM/yyyy HH:mm',
  )}`;
  const finish_date = `Fim: ${format(
    new Date(hours[0].finish_date),
    'dd/MM/yyyy HH:mm',
  )}`;
  const title = `Nova Reserva - ${appointment.user_name} - ${hours[0].court_name} - ${start_date} - ${finish_date}`;
  let notificationMessage = `${hours[0].court_name}\n${start_date}\n${finish_date}`;
  if (materials && materials.length > 0) {
    notificationMessage += `\n\nMateriais: `;
    materials.map(i => {
      notificationMessage += `\n${i.material}: ${i.amount}`;
      return null;
    });
  }
  
  if (white_label().sendAppNotification) {
    const notificationIds = adminUsers.map(item => item.one_signal_id);
    SpecificsNotification(notificationIds, title, notificationMessage);
  };

  const telegramBotToken = '7021742444:AAGY-L8bXVx8YqAS47i9MYyLjDJy7a8Y890';
  const chatId = '@reservasbelavista';
  const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  try {
    axios.post(telegramUrl, {
      chat_id: chatId,
      text: title,
    });
    console.log('Telegram message sent successfully');
  } catch (error) {
    console.error('Error sending Telegram message', error);
  }
};
