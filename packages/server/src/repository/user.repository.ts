import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../user/dto/user.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // 로그인
  async findByLogin(user_id: string, password: string): Promise<User> {
    const user = await this.findOne({ where: { user_id, password } });

    if (!user) {
      throw new ForbiddenException('아이디와 비밀번호를 다시 확인해주세요.');
    }

    return user;
  }

  //유저 생성
  async onCreate(createUserDto: CreateUserDto): Promise<boolean> {
    const { user_id, password, name, nickname } = createUserDto;

    const user = await this.save({
      user_id,
      password,
      salt: '임시',
      name,
      nickname,
    });

    return user ? true : false;
  }

  //모든 유저 조회
  async findAll(): Promise<User[]> {
    return await this.find();
  }

  //단일 유저 조회
  async findById(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    return user;
  }

  //단일 유저 수정
  async onChangeUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    const { name, nickname } = updateUserDto;

    const changeUser = await this.update({ id }, { name, nickname });

    if (changeUser.affected !== 1) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return true;
  }

  //전체 유저 수정
  async onChangeUsers(updateUserDto: UpdateUserDto[]): Promise<boolean> {
    const user = updateUserDto.map((data) => {
      return this.update(data.id, { name: data.name, nickname: data.nickname });
    });

    await Promise.all(user);

    return true;
  }

  //유저 삭제
  async onDelete(id: string): Promise<boolean> {
    /**
     * remove() & delete()
     * - remove: 존재하지 않는 아이템을 삭제하면 404 Error가 발생합니다.
     * - delete: 해당 아이템이 존재 유무를 파악하고 존재하면 삭제하고, 없다면 아무 에러도 발생하지 않는다.
     */
    const deleteUser = await this.delete(id);

    if (deleteUser.affected === 0) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return true;
  }
}
