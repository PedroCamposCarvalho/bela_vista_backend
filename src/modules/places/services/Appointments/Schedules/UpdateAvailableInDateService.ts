import { injectable, inject } from 'tsyringe';

import { differenceInDays, addDays } from 'date-fns';
import IAppointmentsRepository from '../../../repositories/Appointments/IAppointmentsRepository';

interface IRequest {
  type: string;
  year: number;
  month: number;
  id_place: string;
}

@injectable()
class UpdateAvailableInDateService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  private getTax(type: string): number {
    return type === 'pix' ? 0.95 : 2.8;
  }

  private isAvailableToRetrieve(type: string, created_at: Date): boolean {
    if (type === 'pix') {
      if (differenceInDays(new Date(), new Date(created_at)) > 0) {
        return true;
      }
      return false;
    }
    if (differenceInDays(new Date(), new Date(created_at)) > 28) {
      return true;
    }
    return false;
  }

  public async execute(): Promise<void> {
    const appointments = await this.appointmentsRepository.findByMonthYearPlace(
      13,
      1,
      'f13f0061-01f0-476f-9d6c-fe4a1a1f64ca',
    );

    appointments.map(i => {
      let daysToAdd = 1;
      if (i.type !== 'pix') {
        daysToAdd = 28;
      }
      const availableInDate = addDays(new Date(i.created_at), daysToAdd);

      this.appointmentsRepository.updateAvailableInDate(i.id, availableInDate);
      return null;
    });
  }
}

export default UpdateAvailableInDateService;
