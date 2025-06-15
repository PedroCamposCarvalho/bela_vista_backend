import { injectable, inject } from 'tsyringe';

import { differenceInDays, differenceInMinutes, isFuture } from 'date-fns';
import IReturnWebReportDTO from '@modules/places/dtos/Appointments/IReturnWebReportDTO';
import IDayUseRepository from '@modules/day_use/repositories/IDayUseRepository';
import IAppointmentsRepository from '../../../repositories/Appointments/IAppointmentsRepository';

interface IRequest {
  type: string;
  year: number;
  month: number;
  id_place: string;
}

@injectable()
class FindUserHistoryService {
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

  public async execute(data: IRequest): Promise<IReturnWebReportDTO[]> {
    const returnData: IReturnWebReportDTO[] = [];

    const numericType = Number(data.type);

    const appointments = await this.appointmentsRepository.findByMonthYearPlace(
      data.month,
      data.year,
      data.id_place,
    );

    console.log(appointments);

    const dayUse = await this.dayUseRepository.findAllUsersInMonth(
      data.month,
      data.year,
      data.id_place,
    );

    appointments.map((item, index) => {
      if (index > 0) {
        if (
          differenceInMinutes(
            appointments[index - 1].created_at,
            item.created_at,
          ) !== 0
        ) {
          const newData: IReturnWebReportDTO = {
            id: item.id,
            name: item.observation.replace(' - App', ''),
            ssn: item.ssn,
            date: item.start_date,
            grossValue: Number(item.price),
            netValue:
              Number(item.price) -
              (this.getTax(item.type) * Number(item.price)) / 100,
            type: 1,
            id_transaction: item.id_transaction,
            payment_type: this.getTypeDescription(item.type),
            isAvailable: !isFuture(new Date(item.available_in)),
            retrieved: item.retrieved,
            created_at: item.created_at,
            retrieved_date: item.retrieved_date,
            available_in: item.available_in,
          };

          returnData.push(newData);
        }
      } else {
        const newData: IReturnWebReportDTO = {
          id: item.id,
          name: item.observation.replace(' - App', ''),
          ssn: item.ssn,
          date: item.start_date,
          grossValue: Number(item.price),
          netValue: Number(item.price) - (2.8 * Number(item.price)) / 100,
          type: 1,
          id_transaction: item.id_transaction,
          payment_type: this.getTypeDescription(item.type),
          isAvailable: false,
          retrieved: item.retrieved,
          created_at: item.created_at,
          retrieved_date: item.retrieved_date,
          available_in: new Date(),
        };

        returnData.push(newData);
      }
      return null;
    });

    dayUse.map(item => {
      const newData: IReturnWebReportDTO = {
        id: item.id,
        name: item.observation.replace(' - App', ''),
        ssn: '',
        date: item.start_date,
        grossValue: Number(item.paid_price),
        netValue:
          Number(item.paid_price) - (2.8 * Number(item.paid_price)) / 100,
        type: 2,
        id_transaction: item.id_transaction,
        payment_type: item.type,
        isAvailable: this.isAvailableToRetrieve(item.type, item.created_at),
        retrieved: item.payment_retrieved,
        created_at: item.created_at,
        retrieved_date: new Date(),
      };

      returnData.push(newData);
      return null;
    });

    if (numericType === 0) {
      return returnData;
    }

    return returnData.filter(item => item.type === numericType);
  }
}

export default FindUserHistoryService;
