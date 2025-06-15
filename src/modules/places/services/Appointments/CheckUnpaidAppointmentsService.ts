import { injectable, inject } from 'tsyringe';
import { differenceInMinutes } from 'date-fns';
import IAppointmentsRepository from '@modules/places/repositories/Appointments/IAppointmentsRepository';
import Appointment from '@modules/places/infra/typeorm/entities/Appointments/Appointment';
import sendNotification from './methods/sendNotification';
import axios from 'axios';

@injectable()
class CheckUnpaidAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(): Promise<void> {
    try {
      const appointments = await this.appointmentsRepository.findUnpaidAppointments();

      appointments.forEach(async (appointment: Appointment) => {
        const minutesDifference = differenceInMinutes(
          new Date(),
          new Date(appointment.created_at),
        );

        console.log(minutesDifference);

        if (!appointment.paid && !appointment.canceled && minutesDifference >= 5) {
          appointment.canceled = true;
          appointment.observation = `${appointment.observation} - Cancelado por falta de pagamento após 5 minutos`;
          await this.appointmentsRepository.save(appointment);
          await this.sendNotification(`Reserva ${appointment.observation} cancelada por falta de pagamento após 5 minutos`);
        }
      });
    } catch (error) {
      // Log error if needed
      console.error('Error checking unpaid appointments:', error);
    }
  }

  private async sendNotification(title: string): Promise<void> {
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
  }
}

export default CheckUnpaidAppointmentsService; 