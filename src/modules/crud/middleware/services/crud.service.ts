import { Injectable } from '@nestjs/common';
import { UserDTO } from '../../dto/user.dto';

@Injectable()
export class CrudService {
  async createUser(dataUser: UserDTO) {
    console.log(dataUser);
  }
}
