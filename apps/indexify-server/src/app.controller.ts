import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'modules/auth/auth-decorator/public.decorator';
import { Role } from 'modules/auth/auth-decorator/role.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Role('admin')
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
