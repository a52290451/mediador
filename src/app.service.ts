import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthcheck(): Object {
    return {
      Status: "Ok",
      checkCount: check.count++
    };
  }
}

export class check {
  static count: number = 0;
}