import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { Rep, RepSchema } from './user.schema';
import { RepresentativeService } from './user.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Rep.name, schema: RepSchema }])],
  controllers: [UserController],
  providers: [RepresentativeService],
  exports: [RepresentativeService],
})
export class RepresentativeModule {}
