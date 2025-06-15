import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import WhatsAppNotification from '@modules/places/providers/WhatsAppNotification';
import IAppointmentsRepository from '../repositories/Appointments/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments/Appointment';

@injectable()
class UpdatePaidAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id_transaction: string): Promise<Appointment> {
    const adminUsers = await this.usersRepository.findAllAdminUsers();

    const appointment = await this.appointmentsRepository.findByIdTransaction(
      id_transaction,
    );

    if (!appointment) {
      throw new AppError('Appointment not found');
    }

    appointment.paid = true;

    await this.appointmentsRepository.save(appointment);

    const title = `Reserva paga`;

    const notificationMessage = `${appointment.observation.replace(
      ' - App',
      '',
    )}`;

    adminUsers.forEach(item => {
      WhatsAppNotification(item.cellphone, `${title}\n${notificationMessage}`);
    });

    return appointment;
  }
}

export default UpdatePaidAppointmentService;
