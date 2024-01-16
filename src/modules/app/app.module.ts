import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import databaseConfig from 'src/config/database.config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';
import { allCodeModule } from '../allCode/allCode.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from 'src/utils/interceptor/timeout.interceptor';
import { MarkDownModule } from '../markDown/markdown.module';
import { ScheduleModule as UserScheduleModule } from '../schedule/Schedule.module';
import { InfoModule } from '../info/info.module';
import { BookingModule } from '../booking/booking.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { env } from 'process';
import { SpecialtyModule } from '../specialty/specialty.module';
import { ClinicModule } from '../clinic/clinic.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, databaseConfig],
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
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    allCodeModule,
    MarkDownModule,
    UserScheduleModule,
    InfoModule,
    BookingModule,
    SpecialtyModule,
    ClinicModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}
