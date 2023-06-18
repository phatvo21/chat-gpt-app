import { ChatModule } from '@app/chat-api/modules/chat/chat.module';
import { UserRepository } from '@app/chat-api/modules/user/repository/user.repository';
import { UserEntity, UserSchema } from '@app/chat-api/modules/user/schema/user.schema';
import { UserController } from '@app/chat-api/modules/user/user.controller';
import { UserService } from '@app/chat-api/modules/user/userService';
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
  imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]), ChatModule],
  controllers: [UserController],
  providers: [...PROVIDER_AND_EXPORT_MODULES],
  exports: [...PROVIDER_AND_EXPORT_MODULES],
})
export class UserModule {}
