import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { environment } from './config/configuration';
import * as yaml from 'js-yaml';
import { GlobalExceptionFilter } from './errorhandler/error';
import * as express from 'express'; // Importa express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configura el límite de tamaño de carga útil
  app.use(express.json({ limit: '50mb' })); // Ajusta el límite según sea necesario
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('mediador_crud')
    .setDescription('API CRUD mediador')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync('./swagger/swagger.json', JSON.stringify(document, null, 4));
  fs.writeFileSync('./swagger/swagger.yml', yaml.dump(document));
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(environment.HTTP_PORT,10) || 8080);
}
bootstrap();
