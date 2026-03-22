import {
  All,
  Controller,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ConsulService } from './consul/consul.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';

@Controller()
export class GatewayController {
  constructor(
    private readonly consulService: ConsulService,
    private readonly httpService: HttpService,
  ) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const serviceName = req.path.split('/').filter(Boolean)[0];

    if (!serviceName || !/^[a-zA-Z0-9-]+$/.test(serviceName)) {
      throw new HttpException('Cannot process request', HttpStatus.BAD_REQUEST);
    }

    const targetServiceName = `${serviceName}-service`;

    const serviceLocation =
      await this.consulService.discoverService(targetServiceName);
    if (!serviceLocation) {
      throw new HttpException(
        `Service unavailable: ${targetServiceName}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const { Address, Port } = serviceLocation;
    const targetUrl = `http://${Address}:${Port}${req.originalUrl}`;

    try {
      const { data, status, headers } = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: targetUrl,
          data: req.body,
          headers: req.headers as Record<string, string>,
          validateStatus: () => true,
        }),
      );

      return res.status(status).set(headers).json(data);
    } catch (error) {
      const statusCode =
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.response?.data || 'An error occurred in the downstream service.';
      return res.status(statusCode).json({ error: message });
    }
  }
}
