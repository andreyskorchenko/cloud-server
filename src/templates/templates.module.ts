import { Module } from '@nestjs/common';
import { TemplatesService } from '@/templates/templates.service';

@Module({
    providers: [TemplatesService],
    exports: [TemplatesService],
})
export class TemplatesModule {}
