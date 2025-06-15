/* eslint-disable no-loop-func */
import { injectable, inject } from 'tsyringe';
// import SpecificsNotification from '@modules/store/providers/SpecificsNotification';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IScoreRepository from '@modules/score/repositories/IScoreRepository';
import ICreateDayUseUsersDTO from '../dtos/ICreateDayUseUsersDTO';
import DayUseUsers from '../infra/typeorm/entities/DayUseUsers';
import IDayUseRepository from '../repositories/IDayUseRepository';

@injectable()
class CreateDayUseUserService {
  constructor(
    @inject('DayUseRepository')
    private dayUseRepository: IDayUseRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('ScoreRepository')
    private scoreRepository: IScoreRepository,
  ) {}

  public async execute(data: ICreateDayUseUsersDTO): Promise<DayUseUsers> {
    const modules = await this.scoreRepository.findAllModules();

    const scoreRules = await this.scoreRepository.findAllScoreRules();

    let dayUseUser: DayUseUsers = {} as DayUseUsers;

    for (let i = 0; i < data.tickets; i++) {
      this.dayUseRepository.createUser(data).then(response => {
        dayUseUser = response;
      });
    }

    const userPoints = await this.scoreRepository.findUserPoints(data.id_user);
    const scoreRule = scoreRules.filter(j => j.module === 'Day Use')[0];
    if (data.paid_price > 0) {
      const points = Math.floor(
        Number(
          (Number(data.paid_price.toFixed(2)) * scoreRule.points).toFixed(2),
        ) / scoreRule.price,
      );
      await this.scoreRepository.createUserHistory({
        id_user: data.id_user,
        id_module: modules.filter(i => i.name === 'Day Use')[0].id,
        price: Number(data.paid_price.toFixed(2)),
        points: Math.floor(points),
      });
      await this.scoreRepository.updateUserPoints({
        id_user: data.id_user,
        points: Number(userPoints) + Number(points) - Number(data.points),
      });
    } else {
      await this.scoreRepository.updateUserPoints({
        id_user: data.id_user,
        points: Number(userPoints) - Number(data.points),
      });
    }
    if (data.points > 0) {
      await this.scoreRepository.createUserUsedHistory({
        id_user: data.id_user,
        points: data.points,
      });
    }
    // const adminUsers = await this.usersRepository.findAllAdminUsers();
    // const user = await this.usersRepository.findById(data.id_user);
    // const notificationIds = adminUsers.map(item => item.one_signal_id);
    // SpecificsNotification(notificationIds, `Day Use Vendido!`, `${user?.name}`);
    return dayUseUser;
  }
}

export default CreateDayUseUserService;
