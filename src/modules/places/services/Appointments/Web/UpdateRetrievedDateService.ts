import { injectable, inject } from 'tsyringe';
import Appointment from '@modules/places/infra/typeorm/entities/Appointments/Appointment';
import IAppointmentsRepository from '../../../repositories/Appointments/IAppointmentsRepository';

interface IDataProps {
  id_appointment: string;
  date: Date;
}

@injectable()
class UpdateTypeService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(data: IDataProps): Promise<Appointment> {
    const { id_appointment, date } = data;
    const appointment = await this.appointmentsRepository.updateRetrievedDate(
      id_appointment,
      date,
    );

    return appointment;
  }
}

export default UpdateTypeService;
