import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';
import { allCodeModule } from '../allCode/allCode.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from 'src/utils/interceptor/timeout.interceptor';
import { MarkDownModule } from '../markDown/markdown.module';
import { InfoModule } from '../info/info.module';
import { BookingModule } from '../booking/booking.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { env } from 'process';
import { SpecialtyModule } from '../specialty/specialty.module';
import { ClinicModule } from '../clinic/clinic.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '../schedule/schedule.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // load: [configuration, databaseConfig],
      load: [databaseConfig],
    }),
    MailerModule.forRoot({
      transport: {
        host: env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: env.EMAIL_USERNAME,
          pass: env.EMAIL_PASSWORD,
        },
      },
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    allCodeModule,
    MarkDownModule,
    ScheduleModule,
    InfoModule,
    BookingModule,
    SpecialtyModule,
    ClinicModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
  controllers: [AppController],
})
export class AppModule {}