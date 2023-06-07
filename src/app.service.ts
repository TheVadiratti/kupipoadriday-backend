import { Injectable } from '@nestjs/common';
// TODO удалить ненужные методы =>
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
