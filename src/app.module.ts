import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UploaderModule } from './uploader/uploader.module';

@Module({
    imports: [AuthModule, UploaderModule],
})
export class AppModule {}
