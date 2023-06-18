import { UserRepositoryInterface } from '@app/chat-api/modules/user/repository/interface/user-repository.interface';
import { UserDocument, UserEntity } from '@app/chat-api/modules/user/schema/user.schema';
import { BaseRepository } from '@app/common/repositories/base.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> implements UserRepositoryInterface {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  public findOneByToken(token: string): Promise<any> {
    return this.userModel.findOne({ 'token.token': token }).exec();
  }
}
