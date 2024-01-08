import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'modules/auth/decorator/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('healthCheck')
  health(): { message: string } {
    return {
      message: 'Health route works as expected!',
    };
  }
}
