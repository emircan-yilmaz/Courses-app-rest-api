import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SectionsModule } from './sections/sections.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    CoursesModule,
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../config.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE),
    UsersModule,
    AuthModule,
    SectionsModule,
    VideosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
