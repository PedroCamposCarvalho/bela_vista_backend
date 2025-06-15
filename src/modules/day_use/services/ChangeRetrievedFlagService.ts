import { injectable, inject } from 'tsyringe';
import DayUseUsers from '../infra/typeorm/entities/DayUseUsers';
import IDayUseRepository from '../repositories/IDayUseRepository';

@injectable()
class ChangeRetrievedFlagService {
  constructor(
    @inject('DayUseRepository')
    private dayUseRepository: IDayUseRepository,
  ) {}

  public async execute(id_day_use_user: string): Promise<DayUseUsers> {
    const dayUseUser =
      this.dayUseRepository.handleChangeRetrievedFlag(id_day_use_user);

    return dayUseUser;
  }
}

export default ChangeRetrievedFlagService;
