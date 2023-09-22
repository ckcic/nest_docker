import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';

interface EmailOptions { // 메일 옵션 타입
  to: string; // 수신자
  subject: string; // 메일 제목
  html: string; // 메일 본문
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>, // 주입 받을 때는 ConfigFactory의 KEY인 'email' 문자열 넣기
  ) {
    this.transporter = nodemailer.createTransport({ // nodemailer에서 제공하는 Transporter 객체 생성
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      }
    });
  }

  async sendMemberJoinVerification(emailAddress: string, signupVerifyToken: string) {
    const baseUrl = this.config.baseUrl;

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`; // 유저가 누를 버튼이 가질 링크를 구성
    // 이 링크를 통해 다시 우리 서비스로 이메일 인증 요청이 들어옴

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      // 메일 본문 구성, form태그를 이용해 POST 요청
      html: `
        가입확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `
    }

    return await this.transporter.sendMail(mailOptions); // transpoter 객체를 이용해 메일 전송
  }
}
