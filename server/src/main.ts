import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm/out';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './typeorm/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3001;
  const sessionRepo = app.get(getRepositoryToken(Session));
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.use(
    session({
      cookie: {
        maxAge: 360000 * 24,
      },
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepo),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(PORT, () => { console.log(`Running on port ${PORT}`) });
}
bootstrap();
