import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/configuration';
import { LoggerMiddleware } from './logger/logger';
import { Recurso, RecursoSchema } from './models/recurso.dtoSchema';
import { RecursoController } from './controllers/recurso.controller';
import { RecursoService } from './services/recurso.service';
import { Curso, CursoSchema } from './models/curso.dtoSchema';
import { CursoController } from './controllers/curso.controller';
import { CursoService } from './services/curso.service';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://127.0.0.1:27017/mediador`),
    MongooseModule.forFeature([
      { name: Curso.name, schema: CursoSchema },
      { name: Recurso.name, schema: RecursoSchema }
    ])
  ],
  controllers: [AppController, CursoController, RecursoController],
  providers: [AppService, CursoService, RecursoService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}