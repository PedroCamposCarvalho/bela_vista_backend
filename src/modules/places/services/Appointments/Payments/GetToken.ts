import axios from 'axios';
import fs from 'fs';
import https from 'https';
import path from 'path';
import qs from 'qs';
import AppError from '@shared/errors/AppError';

const pfxPath = path.join(__dirname, '4c512409263b3f8a.pfx');
const passphrase = '1ykXo3BX';

export function createHttpsAgent(): https.Agent {
  const pfxCert = fs.readFileSync(pfxPath);
  return new https.Agent({
    pfx: pfxCert,
    passphrase,
  });
}

async function GetToken(httpsAgent: https.Agent): Promise<string> {
  const data = qs.stringify({
    Client_Id: '232576D2C9270862E0630A293573D807',
    Client_Secret:
      'B9C2B848A3DF4AFE9F63408E84189FBEA98C7252F8784A1A9DA2A9682A1C085B',
    scope:
      'cob.read cob.write cobv.read cobv.write pix.read pix.write webhook.read webhook.write qrcode.read qrcode.write payloadlocation.write payloadlocation.read lotecobv.write lotecobv.read',
  });

  try {
    const response = await axios({
      method: 'post',
      url: 'https://pixcobranca.ailos.coop.br/ailos/pix-cobranca/api/v1/client/connect/token',
      data,
      httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Erro:', error);
    throw new AppError('Erro ao obter token');
  }
}

export { GetToken };
