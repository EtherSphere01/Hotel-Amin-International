import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from './DTOs/email.dto';
import { ContactFormDto } from './DTOs/contact-form.dto';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}
  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendEmail(sendEmailDto: EmailDto) {
    const transport = this.emailTransport();
    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: sendEmailDto.recipients,
      subject: sendEmailDto.subject,
      html: sendEmailDto.html,
    };
    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }

  async sendHousekeepingRequestEmail(requestData: {
    room: number;
    phone: string;
    description: string;
    requestId: number;
  }) {
    const transport = this.emailTransport();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Housekeeping Request - Hotel Amin International
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Request Details</h3>
          <p><strong>Request ID:</strong> #${requestData.requestId}</p>
          <p><strong>Room Number:</strong> ${requestData.room}</p>
          <p><strong>Guest Phone:</strong> ${requestData.phone}</p>
          <p><strong>Description:</strong> ${requestData.description}</p>
          <p><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending</span></p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #0066cc;">
            <strong>Action Required:</strong> Please assign housekeeping staff to handle this request.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>This is an automated message from Hotel Amin International's housekeeping request system.</p>
        </div>
      </div>
    `;

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: 'housekeeping@hotelamin.com', 
      subject: `New Housekeeping Request - Room ${requestData.room} (#${requestData.requestId})`,
      html: htmlContent,
    };

    try {
      await transport.sendMail(options);
      console.log('Housekeeping request email sent successfully');
    } catch (error) {
      console.error('Error sending housekeeping request email: ', error);
      throw error;
    }
  }

  async sendContactFormEmail(contactData: ContactFormDto) {
    const transport = this.emailTransport();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #0B3C5D; border-bottom: 3px solid #F5A623; padding-bottom: 15px; margin-bottom: 25px;">
            New Contact Form Message - Hotel Amin International
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px; font-size: 16px;">Contact Details:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #F5A623;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${contactData.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${contactData.email}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 10px; font-size: 16px;">Message:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #0B3C5D;">
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p style="margin: 0;">This message was sent through the Hotel Amin International contact form.</p>
            <p style="margin: 5px 0 0 0;">Please respond directly to: ${contactData.email}</p>
          </div>
        </div>
      </div>
    `;

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: 'universuswebtech@gmail.com', 
      subject: contactData.subject,
      html: htmlContent,
      replyTo: contactData.email, 
    };

    try {
      await transport.sendMail(options);
      console.log('Contact form email sent successfully');
    } catch (error) {
      console.error('Error sending contact form email: ', error);
      throw error;
    }
  }
}
