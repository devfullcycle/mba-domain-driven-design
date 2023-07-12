import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailsService {
  getHello(): string {
    return 'Hello World!';
  }
}
