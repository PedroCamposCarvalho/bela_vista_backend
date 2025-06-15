import axios from 'axios';
import AppError from '@shared/errors/AppError';
import { GetToken, createHttpsAgent } from './GetToken';

interface IReturnProps {
  copiaCola: string;
  qrCode: string;
}

async function ObterCodigoCopiaCola(id: string): Promise<IReturnProps> {
  const httpsAgent = createHttpsAgent();

  try {
    const token = await GetToken(httpsAgent);

    const response = await axios({
      method: 'get',
      url: `https://pixcobranca.ailos.coop.br/ailos/pix-cobranca/api/v1/qrcode/consulta/${id}`,
      httpsAgent,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const copiaColaBase64 = response.data.copiaCola;

    const copiaColaDecoded = Buffer.from(copiaColaBase64, 'base64').toString(
      'utf-8',
    );

    return {
      copiaCola: copiaColaDecoded,
      qrCode: response.data.imagemQrCode,
    };
  } catch (error) {
    console.error('Erro ao obter código copia e cola:', error);
    throw new AppError('Erro ao obter código copia e cola');
  }
}

export default ObterCodigoCopiaCola;
