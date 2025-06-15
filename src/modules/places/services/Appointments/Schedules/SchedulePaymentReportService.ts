import { injectable, inject } from 'tsyringe';

import { differenceInDays } from 'date-fns';
import WhatsAppNotification from '@modules/places/providers/WhatsAppNotification';
import IDayUseRepository from '@modules/day_use/repositories/IDayUseRepository';
import IAppointmentsRepository from '../../../repositories/Appointments/IAppointmentsRepository';

interface IRequest {
  type: string;
  year: number;
  month: number;
  id_place: string;
}

@injectable()
class SchedulePaymentReportService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('DayUseRepository')
    private dayUseRepository: IDayUseRepository,
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

  private getTypeDescription(type: string): string {
    if (type === 'pix') {
      return 'Pix';
    }
    if (type === 'credit_card') {
      return 'Cartão de Crédito';
    }
    return '';
  }

  public async execute(): Promise<void> {
    let valueAvailable = 0;
    const appointments =
      await this.appointmentsRepository.findAppointmentsToSendDailyPaymentReport();

    const dayUse = await this.dayUseRepository.findDayUseToSendDailyReport();

    appointments.map(i => {
      if (this.isAvailableToRetrieve(i.type, i.created_at) && !i.retrieved) {
        const value =
          Number(i.price) - (this.getTax(i.type) * Number(i.price)) / 100;
        valueAvailable += value;
      }
      return null;
    });

    dayUse.map(j => {
      if (
        this.isAvailableToRetrieve(j.type, j.created_at) &&
        !j.payment_retrieved
      ) {
        const value =
          Number(j.paid_price) -
          (this.getTax(j.type) * Number(j.paid_price)) / 100;
        valueAvailable += value;
      }
      return null;
    });

    const title = `Arena ${process.env.CLIENT}`;
    const notificationMessage = `Enviar R$ ${valueAvailable
      .toFixed(2)
      .replace('.', ',')}`;

    WhatsAppNotification('+5511996154995', `${title}\n${notificationMessage}`);
  }
}

export default SchedulePaymentReportService;
