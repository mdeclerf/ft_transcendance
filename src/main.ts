import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  app.setGlobalPrefix('api');
  app.use(
    session({
      cookie: {
        maxAge: 60000 * 60 * 24,
      },
      secret: 'iuasgdiugqweitugqweorijasughasdg',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session())
  await app.listen(port, () => console.log(`Running on port ${port}`));
}
bootstrap();
