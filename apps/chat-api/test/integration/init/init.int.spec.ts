import { AppModule } from '@app/chat-api/app.module';
import { generateMockServer, generateRequest, RequestType, ServerType } from '@app/common/utils/database-test.util';

describe('Integration Init', () => {
  let server: ServerType;
  let request: RequestType;

  beforeAll(async () => {
    server = await generateMockServer([AppModule]);
    request = generateRequest(server);
  });

  afterAll(async () => {
    await server.app.close();
  });

  it('/ (GET)', () => {
    return request.agent.get('/hello-world').expect(200).expect('Hello World!');
  });
});
