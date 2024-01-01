import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshService {
  async refresh(id: string, refresh_token: string) {}
}
