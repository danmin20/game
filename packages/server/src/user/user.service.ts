import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from 'src/common/type';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // google login
  async findByProviderIdOrSave(googleUser: GoogleUser) {
    const { providerId, provider, email, name } = googleUser;

    const user = await this.userRepository.findOne({ where: { providerId } });

    if (user) {
      return user;
    }

    const newUser = new User();
    newUser.provider = provider;
    newUser.providerId = providerId;
    newUser.email = email;
    newUser.name = name;
    newUser.nickname = '';

    return await this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async changeUserNickname(email: string, nickname: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    const updatedUser = await this.userRepository.save({ ...user, nickname });
    return updatedUser;
  }
}
