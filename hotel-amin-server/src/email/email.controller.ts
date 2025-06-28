import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './DTOs/email.dto';
import { ContactFormDto } from './DTOs/contact-form.dto';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth(AuthType.None)
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-email')
  public async sendEmail(@Body() sendEmailDto: EmailDto) {
    await this.emailService.sendEmail(sendEmailDto);
    return { message: 'Email sent successfully' };
  }

  @Post('send-contact')
  public async sendContactForm(@Body() contactFormDto: ContactFormDto) {
    await this.emailService.sendContactFormEmail(contactFormDto);
    return { message: 'Contact form submitted successfully' };
  }
}
