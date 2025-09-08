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
    const serviceName = req.url.split('/')[1]; // ex: /products/123 -> "products"
    if (!serviceName) {
      throw new HttpException('Cannot process request', HttpStatus.BAD_REQUEST);
    }
    const targetServiceName = `${serviceName}-service`;

    // 2. Descobrir a localização do serviço
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
      // 3. Encaminhar a requisição para o serviço de destino
      const { data, status, headers } = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url: targetUrl,
          data: req.body,
          headers: {
            'Content-Type': req.headers['content-type'] || 'application/json',
          },
        }),
      );

      // 4. Retornar a resposta do microsserviço para o cliente original
      res.status(status).set(headers).json(data);
    } catch (error) {
      const statusCode =
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.response?.data || 'An error occurred in the downstream service.';
      throw new HttpException(message, statusCode);
    }
  }
}
