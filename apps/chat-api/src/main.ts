import { AppModule } from '@app/chat-api/app.module';
import { bootstrap } from '@app/common/utils/boostrap.util';

bootstrap(AppModule, { title: 'Chat API', server: '/ws-chat-api' });
