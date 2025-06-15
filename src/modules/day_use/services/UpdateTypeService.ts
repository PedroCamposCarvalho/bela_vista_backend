import { injectable, inject } from 'tsyringe';
import axios from 'axios';
import white_label from '../../../white_label';
import IDayUseRepository from '../repositories/IDayUseRepository';

@injectable()
class UpdateTypeService {
  constructor(
    @inject('DayUseRepository')
    private dayUseRepository: IDayUseRepository,
  ) {}

  public async execute(): Promise<boolean> {
    const dayUseUsers = await this.dayUseRepository.findAllPaidDayUseUsers();

    dayUseUsers.map(async item => {
      axios
        .get(`https://app.vindi.com.br/api/v1/charges/${item.id_transaction}`, {
          auth: {
            username: white_label().payment_private_api_key,
            password: '',
          },
        })
        .then(response => {
          const type =
            response.data.charge.last_transaction.gateway_response_fields
              .payment_method_name;

          this.dayUseRepository.updateDayUseUserType(
            item.id,
            type === 'Pix' ? 'pix' : 'credit_card',
          );
        })
        .catch(() => {});
    });

    return true;
  }
}

export default UpdateTypeService;
