import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { env } from 'process';
import * as jwt from 'jsonwebtoken';
import * as routes from './../../../../utils/routes';
import * as constants from './../../../../utils/constants';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  private readonly saltOrRounds = 10;
  private readonly coolDownVerify: number = 30; // 30 minutes

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  private htmlSendMail({
    customerName,
    bookAt,
    scheduleTime,
    doctorData,
    lang,
    redirectLink,
  }) {
    const stringVi = `
      <div>
        <br>
        Xin chào <strong>${customerName}</strong>
        <p>Đây là thông tin lịch hẹn mà bạn đã đặt trước đó trên <a href="https://www.youtube.com/"
            target="_blank">Youtube</a></p>
        <p><strong>Đặt lúc: </strong>${bookAt}</p>
        <p><strong>Hẹn khám: </strong>${scheduleTime}</p>
        <p><strong>Bác sỹ: </strong>${doctorData.nameVi}</p>
        <p><strong>Giá khám: </strong>${doctorData.priceInfo?.valueVi} VND</p>
        <p>Nếu các thông tin trên là <strong>ĐÚNG</strong> sự thật. Vui lòng click vào <a href="${redirectLink}"
            target="_blank">đây</a> để xác nhận và hoàn tất thủ tục đặt lịch khám trong phút</p>
        <p>Đường dẫn chỉ tồn tại trong <strong>${this.coolDownVerify}</strong> phút kể từ lúc gửi</p>
        <h4>Xin chân thành cảm ơn</h4>
      </div>
      `;
    const stringEn = `
      <div>
        <br>
        Hello <strong>${customerName}</strong>
        <p>This is the appointment information you previously booked on <a href="https://www.youtube.com/"
            target="_blank">Youtube</a></p>
        <p><strong>Booked at: </strong>${bookAt}</p>
        <p><strong>Scheduled time: </strong>${scheduleTime}</p>
        <p><strong>Doctor: </strong>${doctorData.nameEn}</p>
        <p><strong>Cost: </strong>$ ${doctorData.priceInfo?.valueEn}</p>
        <p>If the above information is <strong>CORRECT</strong>, please click <a href="${redirectLink}"
            target="_blank">here</a> to
          confirm and complete the appointment booking process</p>
        <p>Link only exists for <strong>${this.coolDownVerify}</strong> minutes from sent</p>
        <h4>Sincerely thank you</h4>
      </div>
      `;
    return lang === constants.LANGUAGES.EN ? stringEn : stringVi;
  }
  private redirectUrl(uniqueString: string) {
    const token = jwt.sign(
      {
        data: uniqueString,
        exp: Math.floor(Date.now() / 1000) + this.coolDownVerify * 60,
      },
      env.SECRET_KEY,
    );

    return `${env.URL_REACT}/${routes.verifyPath}/?token=${token}`;
  }

  async PatientBookAppointments({
    patient,
    booking,
    appInfo,
  }): Promise<boolean> {
    try {
      const payloadUser = { ...patient };
      payloadUser.id && delete payloadUser.id;
      const userInfo = await this.prisma.user.upsert({
        where: {
          email: payloadUser.email,
        },
        update: {
          firstName: payloadUser.firstName,
          lastName: payloadUser.lastName || 'None',
        },
        create: {
          ...payloadUser,
          password: await bcrypt.hash(payloadUser.password, this.saltOrRounds),
        },
      });

      if (userInfo) {
        const payloadBooking = {
          ...booking,
          patientId: userInfo.id,
          updateAt: new Date(),
        };
        const uniqueString = uuid();
        const appointments = await this.prisma.booking.upsert({
          where: {
            patientId: userInfo.id,
          },
          update: payloadBooking,
          create: { ...payloadBooking, uniqueString },
        });
        if (!appointments) {
          throw new HttpException(
            'No schedules were created. Check your input data. allow to book but got error',
            HttpStatus.BAD_REQUEST,
          );
        }

        const { lang, dataTime, doctorData } = appInfo;
        const customerName =
          lang === constants.LANGUAGES.VI
            ? userInfo.lastName.toLocaleLowerCase() === 'none'
              ? `${userInfo.firstName}`
              : `${userInfo.firstName} ${userInfo.lastName}`
            : userInfo.lastName.toLocaleLowerCase() === 'none'
              ? `${userInfo.firstName}`
              : `${userInfo.lastName} ${userInfo.firstName}`;

        let bookAt: any = appointments.updateAt;
        bookAt =
          lang === constants.LANGUAGES.EN
            ? moment(bookAt).format('h:mm:ss a - ddd - MM/DD/YYYY')
            : this.capitalizeFirstLetter(
                moment(bookAt)
                  .locale('vi')
                  .format('h:mm:ss - dddd - DD/MM/YYYY'),
              );
        const scheduleTime =
          lang === constants.LANGUAGES.EN
            ? dataTime?.valueEn
            : dataTime?.valueVi;

        const contentMail = this.htmlSendMail({
          customerName,
          bookAt,
          scheduleTime,
          doctorData,
          lang,
          redirectLink: this.redirectUrl(uniqueString),
        });

        let mailInfo = null;
        if (contentMail)
          mailInfo = await this.mailerService.sendMail({
            //from: `anhlaquan4@gmail.com`, // sender address
            to: userInfo.email, // list of receivers
            subject:
              lang === constants.LANGUAGES.EN
                ? `Confirm mail ✉️`
                : `Thư xác nhận ✉️`,
            html: contentMail,
          });

        return !!(appointments && mailInfo);
      }
      throw new HttpException(
        'No schedules were created. Not allow to book.',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, env.SECRET_KEY);
      if (decoded) {
        const isExist = await this.prisma.booking.findFirst({
          where: {
            uniqueString: decoded.data,
            statusId: constants.STATUS_NEW,
          },
        });
        if (isExist) {
          const booking = await this.prisma.booking.update({
            where: {
              uniqueString: decoded.data,
            },
            data: {
              statusId: constants.STATUS_CONFIRMED,
            },
          });
          if (booking) {
            return !!booking;
          }
          throw new HttpException(
            'Failed to confirm',
            HttpStatus.EXPECTATION_FAILED,
          );
        }
        throw new HttpException(
          'Appointment has been activated or not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return false;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
