/* eslint-disable no-unused-expressions */

import { injectable, inject } from 'tsyringe';

import IMonthlyUserMissedDaysRepository from '../repositories/IMonthlyUserMissedDaysRepository';

@injectable()
class RemoveMonthlyUserMissedDaysService {
  constructor(
    @inject('MonthlyUserMissedDaysRepository')
    private monthlyUserMissedDaysRepositoryRepository: IMonthlyUserMissedDaysRepository,
  ) {}

  public async execute(id_monthly: string): Promise<void> {
    await this.monthlyUserMissedDaysRepositoryRepository.removeMonthlyUserMissedDays(
      id_monthly,
    );
  }
}

export default RemoveMonthlyUserMissedDaysService;
