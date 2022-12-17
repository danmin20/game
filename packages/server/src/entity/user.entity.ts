import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'user' })
@Unique(['user_id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, comment: 'id' })
  user_id: string;

  @Column({ type: 'varchar', length: 255, comment: 'password' })
  password: string;

  @Column({ type: 'varchar', length: 255, comment: 'salt' })
  salt: string;

  @Column({ type: 'varchar', length: 30, comment: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 30, comment: 'nickname' })
  nickname: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;
}
