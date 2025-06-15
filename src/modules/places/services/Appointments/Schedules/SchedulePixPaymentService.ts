import { injectable, inject } from 'tsyringe';
import { differenceInMinutes } from 'date-fns';
import IAppointmentsRepository from '../../../repositories/Appointments/IAppointmentsRepository';

@injectable()
class SchedulePixPaymentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(): Promise<void> {
    try {
      const appointments =
        await this.appointmentsRepository.findUnpaidAppointments();

      appointments.forEach(async i => {
        const minutesDifference = differenceInMinutes(
          new Date(),
          new Date(i.created_at),
        );

        if (!i.paid && !i.canceled) {
          if (minutesDifference >= 20) {
            i.canceled = true;
            i.observation = `${i.observation} - Cancelado por falta de pagamento`;
            this.appointmentsRepository.save(i);
          }
        }
      });
    } catch (error) {
      // console.log(error);
    }
  }
}

export default SchedulePixPaymentService;
