import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { env } from 'process';
import * as jwt from 'jsonwebtoken';
import * as routes from './../../../../utils/routes';
import * as constants from './../../../../utils/constants';
import { exclude } from 'src/utils/function';
import { FormDataSendRemedyDTO } from 'src/utils/dto/formData.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  private readonly saltOrRounds = 10;
  private readonly coolDownVerify: number = 30; // 30 minutes
  private readonly logger = new Logger(BookingService.name);

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private generateInfoLine(
    labelVi: string,
    labelEn: string,
    value: any,
    lang: string,
  ) {
    if (value !== undefined) {
      return lang === constants.LANGUAGES.VI
        ? `<p><strong>${labelVi}: </strong>${value}</p>`
        : `<p><strong>${labelEn}: </strong>${value}</p>`;
    }
    return '';
  }

  private htmlSendMail({
    customerName,
    bookAt,
    scheduleTime,
    doctorData,
    lang,
    redirectLink,
    gender,
    note,
  }) {
    const genderLine = this.generateInfoLine(
      'Giới tính',
      'Gender',
      gender,
      lang,
    );
    const bookAtLine = this.generateInfoLine(
      'Đặt lúc',
      'Book at',
      bookAt,
      lang,
    );
    const scheduleTimeLine = this.generateInfoLine(
      'Hẹn khám',
      'Schedule time',
      scheduleTime,
      lang,
    );
    const noteLine = this.generateInfoLine(
      'Lý do khám',
      'Reason for examination',
      note,
      lang,
    );
    const doctorNameVi = this.generateInfoLine(
      'Bác sỹ',
      'Doctor',
      doctorData.nameVi,
      lang,
    );
    const doctorNameEn = this.generateInfoLine(
      'Bác sỹ',
      'Doctor',
      doctorData.nameEn,
      lang,
    );

    const priceVi = this.generateInfoLine(
      'Giá khám',
      'Cost',
      `${doctorData?.priceInfo?.valueVi} VND`,
      lang,
    );
    const priceEn = this.generateInfoLine(
      'Giá khám',
      'Cost',
      `$ ${doctorData.priceInfo?.valueEn}`,
      lang,
    );

    const stringVi = `
      <div>
        <br>
        Xin chào <strong>${customerName}</strong>
        <p>Đây là thông tin lịch hẹn mà bạn đã đặt trước đó trên <a href="https://www.youtube.com/"
            target="_blank">Youtube</a></p>
        ${genderLine}
        ${bookAtLine}
        ${scheduleTimeLine}
        ${noteLine}
        ${lang === constants.LANGUAGES.VI ? doctorNameVi : doctorNameEn}
        ${lang === constants.LANGUAGES.VI ? priceVi : priceEn}
        <p>Nếu các thông tin trên là <strong>ĐÚNG</strong> sự thật. Vui lòng click vào <a href="${redirectLink}"
            target="_blank">đây</a> để xác nhận và hoàn tất thủ tục đặt lịch khám trong phút</p>
        <p>Đường dẫn chỉ tồn tại trong <strong>${
          this.coolDownVerify
        }</strong> phút kể từ lúc gửi</p>
        <h4>Xin chân thành cảm ơn</h4>
      </div>
      `;

    const stringEn = `
      <div>
        <br>
        Hello <strong>${customerName}</strong>
        <p>This is the appointment information you previously booked on <a href="https://www.youtube.com/"
            target="_blank">Youtube</a></p>
        ${genderLine}
        ${bookAtLine}
        ${scheduleTimeLine}
        ${noteLine}
        ${doctorNameEn}
        ${priceEn}
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

    return `${env.FRONTEND_URL}/${routes.verifyPath}/?token=${token}`;
  }

  private async sendAttachmentMail(
    payload: FormDataSendRemedyDTO,
    buffer: Buffer,
  ) {
    try {
      const medicalBillStringVi = `
        <div>
          <br>
          Xin chào <strong>${payload.patientName}</strong>,
          <p>Dưới đây là thông tin về hóa đơn y tế của bạn:</p>
          <p>Nếu bạn cần thêm thông tin hoặc có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
          <h4>Xin chân thành cảm ơn</h4>
        </div>
      `;

      const medicalBillStringEn = `
        <div>
          <br>
          Hello <strong>${payload.patientName}</strong>,
          <p>Here is the information about your medical bill:</p>
          <p>If you need additional information or have any questions, feel free to contact us.</p>
          <h4>Sincerely thank you</h4>
        </div>
      `;

      const medicalBillString =
        payload.lang === constants.LANGUAGES.VI
          ? medicalBillStringVi
          : medicalBillStringEn;

      const mail = await this.mailerService.sendMail({
        to: payload.email,
        subject:
          payload.lang === constants.LANGUAGES.EN
            ? 'Medical bill🚑💊'
            : 'Hóa đơn y tế 🩹🩸',
        html: medicalBillString,
        attachments: [
          {
            filename: `${uuid()}-${payload.patientName}.png`,
            content: await Buffer.from(buffer).toString('base64'),
            encoding: 'base64',
          },
        ],
      });
      if (!mail) {
        throw new HttpException('No mail sent', HttpStatus.BAD_REQUEST);
      }
      return mail;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
        const patient = await this.prisma.user.findFirst({
          where: {
            id: userInfo.id,
          },
          include: {
            genderData: {
              select: {
                valueVi: true,
                valueEn: true,
              },
            },
          },
        });
        if (patient) {
          const payloadBooking = {
            ...booking,
            patientId: patient.id,
            updateAt: new Date(),
            statusId: constants.STATUS_NEW,
          };

          const uniqueString = uuid();

          const appointments = await this.prisma.booking.upsert({
            where: {
              patientId: patient.id,
            },
            update: { ...payloadBooking, uniqueString },
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
              ? patient.lastName.toLocaleLowerCase() === 'none'
                ? `${patient.firstName}`
                : `${patient.firstName} ${patient.lastName}`
              : patient.lastName.toLocaleLowerCase() === 'none'
                ? `${patient.firstName}`
                : `${patient.lastName} ${patient.firstName}`;

          let bookAt: any = appointments.updateAt;
          bookAt =
            lang === constants.LANGUAGES.EN
              ? moment(bookAt).format('h:mm a - ddd - MM/DD/YYYY')
              : this.capitalizeFirstLetter(
                  moment(bookAt)
                    .locale('vi')
                    .format('h:mm - dddd - DD/MM/YYYY'),
                );
          const scheduleTime =
            lang === constants.LANGUAGES.EN
              ? dataTime?.valueEn
              : dataTime?.valueVi;

          const gender =
            lang === constants.LANGUAGES.EN
              ? patient?.genderData?.valueEn
              : patient?.genderData?.valueVi;

          const contentMail = this.htmlSendMail({
            customerName,
            bookAt,
            scheduleTime,
            doctorData,
            lang,
            redirectLink: this.redirectUrl(uniqueString),
            gender,
            note: payloadBooking.note,
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

  async handleSendRemedy(payload: FormDataSendRemedyDTO) {
    try {
      const appointment = await this.prisma.booking.update({
        where: {
          patientId: +payload.patientId,
          doctorId: +payload.doctorId,
          timeType: payload.timeType,
          // statusId: constants.STATUS_CONFIRMED,
        },
        data: {
          statusId: constants.STATUS_DONE,
        },
      });
      if (!appointment) {
        throw new HttpException('No appointment found', HttpStatus.NOT_FOUND);
      }

      await this.sendAttachmentMail(payload, payload.file?.buffer);

      return { appointment };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async readAppointMentByDateAndDoctorId(doctorId: number, dateNumber: number) {
    try {
      const appointments = await this.prisma.booking.findMany({
        take: +env.MAX_RECORD_LENGTH,
        where: {
          doctorId,
          DateAppointment: new Date(dateNumber),
          statusId: constants.STATUS_CONFIRMED,
        },
        include: {
          patientInfo: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              address: true,
              gender: true,
              genderData: true,
              phoneNumber: true,
            },
          },
          time: {
            select: {
              valueEn: true,
              valueVi: true,
            },
          },
        },
      });
      const { length } = appointments;
      if (length < 1) {
        throw new HttpException(
          'No appointments were found',
          HttpStatus.NOT_FOUND,
        );
      }
      return appointments.map(
        (item) => exclude(item, ['password', 'createAt', 'updateAt']) || item,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_SECOND, { name: 'notifications' })
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }
}
