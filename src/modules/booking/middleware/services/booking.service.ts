import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as constants from './../../../../utils/constants';
import * as moment from 'moment';

const saltOrRounds = 10;
@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  private htmlSendMail({
    customerName,
    bookAt,
    scheduleTime,
    doctorData,
    lang,
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
        <p>Nếu các thông tin trên là <strong>đúng</strong> sự thật. Vui lòng click vào <a href="https://www.youtube.com/"
            target="_blank">đây</a> để xác nhận và hoàn tất thủ tục đặt lịch khám</p>
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
        <p>If the above information is <strong>correct</strong>, please click <a href="https://www.youtube.com/"
            target="_blank">here</a> to
          confirm and complete the appointment booking process</p>
        <h4>Sincerely thank you</h4>
      </div>
      `;
    return lang === constants.LANGUAGES.EN ? stringEn : stringVi;
  }

  async PatientBookAppointments({ patient, booking, appInfo }) {
    try {
      const payloadUser = { ...patient };
      payloadUser.id && delete payloadUser.id;
      const userInfo = await this.prisma.user.upsert({
        where: {
          email: payloadUser.email,
        },
        update: {},
        create: {
          ...payloadUser,
          password: await bcrypt.hash(payloadUser.password, saltOrRounds),
        },
      });

      const payloadBooking = {
        ...booking,
        patientId: userInfo.id,
        updateAt: new Date(),
      };
      if (userInfo) {
        const appointments = await this.prisma.booking.upsert({
          where: {
            patientId: userInfo.id,
          },
          update: payloadBooking,
          create: payloadBooking,
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
            ? `${userInfo.firstName} ${userInfo.lastName}`
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
        });
        let mailInfo = null;
        if (contentMail)
          mailInfo = await this.mailerService.sendMail({
            //from: `anhlaquan4@gmail.com`, // sender address
            to: userInfo.email, // list of receivers
            subject:
              lang === constants.LANGUAGES.EN
                ? `Confirm mail ✉️`
                : `Thư xác nhận ✉️`, // Subject line
            html: contentMail,
          });

        return { appointments, mailInfo };
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
}
