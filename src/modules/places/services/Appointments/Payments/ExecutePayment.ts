import axios from 'axios';
import { injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { GetToken, createHttpsAgent } from './GetToken';
import ObterCodigoCopiaCola from './ObterCodigoCopiaCola';

interface IRequestParams {
  valor: number;
  nome: string;
  cpf: string;
}

interface IReturnProps {
  id_transaction: string;
  copiaCola: string;
  qrCode: string;
}

@injectable()
class ExecutePayment {
  public async execute(data: IRequestParams): Promise<IReturnProps> {
    const httpsAgent = createHttpsAgent();

    try {
      const token = await GetToken(httpsAgent);
      const paymentData = {
        calendario: {
          expiracao: 3600,
        },
        devedor: {
          nome: data.nome,
          cpf: data.cpf.replace('.', '').replace('.', '').replace('-', ''),
        },
        valor: {
          original: data.valor,
        },
        chave: '00347982930',
        solicitacaoPagador: 'Pagamento de reserva',
      };

      const response = await axios({
        method: 'post',
        url: 'https://pixcobranca.ailos.coop.br/ailos/pix-cobranca/api/v1/cob',
        data: paymentData,
        httpsAgent,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const parametrosRetorno = await ObterCodigoCopiaCola(response.data.txid);

      const retorno = {
        id_transaction: response.data.txid,
        copiaCola: parametrosRetorno.copiaCola,
        qrCode: parametrosRetorno.qrCode,
      };

      return retorno;
    } catch (error) {
      console.error('Erro no pagamento:', error);
      throw new AppError('Erro ao executar pagamento');
    }
  }
}

export default ExecutePayment;
