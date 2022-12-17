import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from '../entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @description @Body 방식 - @Body 어노테이션 여러개를 통해 요청 객체를 접근할 수 있습니다.
   */
  @Post('/create_user')
  @UsePipes(ValidationPipe)
  onCreateUser(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    return this.userService.onCreateUser(createUserDto);
  }

  /**
   * @description 전체 유저 조회
   */
  @Get('/user_all')
  getUserAll(): Promise<User[]> {
    return this.userService.getUserAll();
  }

  /**
   * @description @Query 방식 - 단일 유저 조회
   */
  @Get('/user')
  findByUserOne1(@Query('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findByUserOne(id);
  }

  /**
   * @description @Param 방식 - 단일 유저 조회
   */
  @Get('/user/:id')
  findByUserOne2(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findByUserOne(id);
  }

  /**
   * @description @Param & @Body 혼합 방식 - 단일 유저 수정
   */
  @Patch('/user/:id')
  @UsePipes(ValidationPipe)
  setUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.userService.setUser(id, updateUserDto);
  }

  /**
   * @description @Body 방식 - 전체 유저 수정
   */
  @Put('/user/update')
  @UsePipes(ValidationPipe)
  setAllUser(@Body() updateUserDto: UpdateUserDto[]): Promise<boolean> {
    return this.userService.setAllUser(updateUserDto);
  }

  /**
   * @description @Query 방식 - 단일 유저 삭제
   */
  @Delete('/user/delete')
  deleteUser(@Query('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
