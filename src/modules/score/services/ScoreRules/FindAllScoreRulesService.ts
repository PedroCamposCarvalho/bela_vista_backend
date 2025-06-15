import { injectable, inject } from 'tsyringe';

import ScoreRule from '../../infra/typeorm/entities/ScoreRule';
import IScoreRepository from '../../repositories/IScoreRepository';

@injectable()
class FindAllScoreRulesService {
  constructor(
    @inject('ScoreRepository')
    private scoreRepository: IScoreRepository,
  ) {}

  public async execute(): Promise<ScoreRule[]> {
    const scoreRules = await this.scoreRepository.findAllScoreRules();

    return scoreRules;
  }
}

export default FindAllScoreRulesService;
