import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '@modules/places/repositories/Appointments/IAppointmentsRepository';
import ConsultarCobranca from './Payments/ConsultarCobranca';

@injectable()
class CheckUnpaidPaymentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('ConsultarCobranca')
    private consultarCobranca: ConsultarCobranca,
  ) {}

  public async execute(): Promise<void> {
    try {
      console.log('Checking unpaid payments...');
      
      const unpaidAppointments = await this.appointmentsRepository.findUnpaidAppointments();

      console.log(`Found ${unpaidAppointments.length} unpaid appointments`);

      for (const appointment of unpaidAppointments) {
        try {
          if (appointment.id_transaction) {
            console.log(`Checking payment for appointment ${appointment.id} with transaction ${appointment.id_transaction}`);
            
            const result = await this.consultarCobranca.execute(appointment.id_transaction);
            
            if (result.status === 'paid') {
              console.log(`Payment confirmed for appointment ${appointment.id}`);
            } else {
              console.log(`Payment still pending for appointment ${appointment.id}`);
            }
          } else {
            console.log(`Appointment ${appointment.id} has no transaction ID`);
          }
        } catch (error) {
          console.error(`Error checking payment for appointment ${appointment.id}:`, error);
        }
      }
      
      console.log('Finished checking unpaid payments');
    } catch (error) {
      console.error('Error in CheckUnpaidPaymentsService:', error);
    }
  }
}

export default CheckUnpaidPaymentsService; 