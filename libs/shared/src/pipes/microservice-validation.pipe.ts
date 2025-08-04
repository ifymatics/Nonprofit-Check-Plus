// import {
//   ArgumentMetadata,
//   BadRequestException,
//   Injectable,
//   PipeTransform,
// } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
// import { plainToInstance } from 'class-transformer';
// import { validate } from 'class-validator';

// @Injectable()
// export class MicroserviceValidationPipe implements PipeTransform {
//   async transform(value: any, metadata: ArgumentMetadata) {
//     const { metatype } = metadata;

//     // 🚫 Don't validate if no metatype or metatype is primitive
//     if (!metatype || !this.toValidate(metatype)) {
//       return value;
//     }

//     const object = plainToInstance(metatype, value);
//     const errors = await validate(object);

//     if (errors.length > 0) {
//       const formattedErrors = errors.map((err) => ({
//         property: err.property,
//         constraints: err.constraints,
//       }));

//       throw new RpcException({
//         statusCode: 400,
//         message: 'Validation failed',
//         errors: formattedErrors,
//       });
//     }

//     return value;
//   }

//   private toValidate(metatype: any): boolean {
//     const types: any[] = [String, Boolean, Number, Array, Object];
//     return !types.includes(metatype);
//   }
// }

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class MicroserviceValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.shouldValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true, // Remove unknown properties
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Validation failed',
        errors: this.formatErrors(errors),
      });
    }

    return object;
  }

  private shouldValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    return errors.map((err) => ({
      property: err.property,
      constraints: err.constraints,
    }));
  }
}
