import { UserEntity } from '@app/chat-api/user/schema/user.schema';
import { BaseRepositoryInterface } from '@app/common/repositories/base-repository.interface';

export interface UserRepositoryInterface extends BaseRepositoryInterface<UserEntity> {
  findOneByToken(token: string): Promise<UserEntity>;
}
