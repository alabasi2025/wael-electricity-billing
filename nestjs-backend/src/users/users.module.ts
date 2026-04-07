import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { SysDataEntity } from './entities/sysdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SysDataEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
