import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Appointment from '../../infra/typeorm/entities/Appointments/Appointment';
import ICreateAppointmentDTO from '../../dtos/Appointments/ICreateAppointmentDTO';
import IAppointmentsRepository from '../../repositories/Appointments/IAppointmentsRepository';
import IPlacesRepository from '../../repositories/Places/IPlacesRepository';

import verifyAppointmentExistsInSameHour from './methods/verifyAppointmentExistsInSameHour';
import sendNotification from './methods/sendNotification';

@injectable()
class CreateAppointmentservice {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('PlacesRepository')
    private placesRepository: IPlacesRepository,
  ) {}

  public async execute(data: ICreateAppointmentDTO): Promise<Appointment[]> {
    try {
      const appointmentsToReturn: Appointment[] = [];

      const adminUsers = await this.usersRepository.findAllAdminUsers();

      const { hours, appointment, materials } = data;

      const place = await this.placesRepository.findById(appointment.id_place);

      const appointmentsInMonth =
        await this.appointmentsRepository.findAllInMonth(
          new Date(hours[0].start_date).getMonth() + 1,
        );

      const duplicateAppointment = verifyAppointmentExistsInSameHour(
        hours,
        appointmentsInMonth,
      );

      hours.map(async item => {
        if (!duplicateAppointment) {
          const newAppointment =
            await this.appointmentsRepository.createAppointmentHour(
              item,
              appointment,
            );

          if (appointment.id_user > '') {
            await this.appointmentsRepository.createAppointmentUser(
              newAppointment.id,
              appointment.id_user,
            );
          }

          appointmentsToReturn.push(newAppointment);

          if (materials && materials.length > 0) {
            const filteredMaterials = materials.filter(
              material => material.id_hour === item.id,
            );

            filteredMaterials.map(async item2 => {
              await this.appointmentsRepository.createAppointmentMaterial(
                item2,
                newAppointment.id,
              );
            });
          }
        }
      });

      if (duplicateAppointment) {
        throw new AppError('Appointment already exists');
      }

      if (String(process.env.NOTIFICATION) === 'YES') {
        sendNotification(adminUsers, hours, appointment, materials, place);
      }

      return appointmentsToReturn;
    } catch (error) {
      throw new Error();
    }
  }
}

export default CreateAppointmentservice;
