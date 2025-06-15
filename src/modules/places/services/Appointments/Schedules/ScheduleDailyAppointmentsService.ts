import { injectable, inject } from 'tsyringe';
import { format } from 'date-fns';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import WhatsAppNotification from '@modules/places/providers/WhatsAppNotification';
import IAppointmentsRepository from '../../../repositories/Appointments/IAppointmentsRepository';

@injectable()
class ScheduleDailyAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<void> {
    const today = new Date();

    const adminUsers = await this.usersRepository.findAllAdminUsers();

    const appointments = await this.appointmentsRepository.findAllInDay({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      id_place: '',
    });

    if (appointments.length > 0) {
      let text = 'Reservas no dia de hoje:\n\n\n';
      appointments.map(item => {
        const start_date = `Início: ${format(
          new Date(item.start_date),
          'dd/MM/yyyy HH:mm',
        )}`;
        const finish_date = `Fim: ${format(
          new Date(item.finish_date),
          'dd/MM/yyyy HH:mm',
        )}`;
        const message = `${item.observation}\n${start_date} até ${finish_date}\n\n`;
        text += message;
        return null;
      });
      adminUsers.map(item => {
        WhatsAppNotification(item.cellphone, text);
        return null;
      });
    }
  }
}

export default ScheduleDailyAppointmentsService;
