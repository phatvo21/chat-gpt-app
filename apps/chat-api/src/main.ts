import { AppModule } from '@app/chat-api/app.module';
import { bootstrap } from '@app/common/utils/boostrap.util';

bootstrap(AppModule, { title: 'Simple API', server: '/ws-chat-api' });
