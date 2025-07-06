import axios from 'axios';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '@modules/places/repositories/Appointments/IAppointmentsRepository';
import { GetToken, createHttpsAgent } from './GetToken';

interface IReturnProps {
  status: string;
}
@injectable()
class ConsultarCobranca {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(id: string): Promise<IReturnProps> {
    const httpsAgent = createHttpsAgent();

    try {
      const token = await GetToken(httpsAgent);

      console.log(`[ConsultarCobranca] Executando consulta para ID: ${id}`);

      const response = await axios({
        method: 'get',
        url: `https://pixcobranca.ailos.coop.br/ailos/pix-cobranca/api/v1/cob/${id}`,
        httpsAgent,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'CONCLUIDA') {
        const appointment =
          await this.appointmentsRepository.findByIdTransaction(id);
        if (!appointment) {
          throw new AppError('Appointment not found');
        }
        appointment.paid = true;
        await this.appointmentsRepository.save(appointment);
        return { status: 'paid' };
      }
      return { status: 'pending' };
    } catch (error) {
      console.error('Erro ao obter código copia e cola:', error);
      throw new AppError('Erro ao obter código copia e cola');
    }
  }
}

export default ConsultarCobranca;
