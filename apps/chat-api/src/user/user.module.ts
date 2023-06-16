import { UserRepository } from '@app/chat-api/user/repository/user.repository';
import { UserEntity, UserSchema } from '@app/chat-api/user/schema/user.schema';
import { UserService } from '@app/chat-api/user/userService';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const PROVIDER_AND_EXPORT_MODULES = [
  {
    provide: 'UserRepositoryInterface',
    useClass: UserRepository,
  },
  UserService,
];

@Module({
  imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
  controllers: [],
  providers: [...PROVIDER_AND_EXPORT_MODULES],
  exports: [...PROVIDER_AND_EXPORT_MODULES],
})
export class UserModule {}
