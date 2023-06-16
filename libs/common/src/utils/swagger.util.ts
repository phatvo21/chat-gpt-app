import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const AddSwagger = (app: INestApplication, title: string, server: string, commitHash: string): void => {
  const documentConfig = new DocumentBuilder().setTitle(title).setVersion(commitHash).addServer(server).build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('documents', app, document);
};
