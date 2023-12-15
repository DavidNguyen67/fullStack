// import {
//   PipeTransform,
//   Injectable,
//   ArgumentMetadata,
//   BadRequestException,
// } from '@nestjs/common';
// import { validate } from 'class-validator';
// import { plainToClass } from 'class-transformer';
// import { CreateUserDto } from 'src/utils/dto/User.dto'; // Import your DTO

// @Injectable()
// export class CreatingPipe implements PipeTransform {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   async transform(value: any, metadata: ArgumentMetadata) {
//     if (!Array.isArray(value)) {
//       throw new BadRequestException('Invalid input data');
//     }

//     const errors = [];

//     // Convert each item in the array to CreateUserDto and validate
//     const validatedData = await Promise.all(
//       value.map(async (item: any) => {
//         const object = plainToClass(CreateUserDto, item);
//         const validationErrors = await validate(object);
//         if (validationErrors.length > 0) {
//           errors.push(validationErrors);
//         }
//         return object;
//       }),
//     );

//     if (errors.length > 0) {
//       throw new BadRequestException({ message: 'Validation failed', errors });
//     }

//     return validatedData;
//   }
// }
