import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { AuthModule } from '../auth/auth.module';
import { JobApplyModule } from '../job-apply/job-apply.module';

@Module({
    imports:[
        AuthModule,
        JobApplyModule
    ],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}