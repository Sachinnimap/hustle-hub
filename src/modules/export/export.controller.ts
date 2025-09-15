import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import {Response} from 'express';
import { ExportService } from './export.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUserGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@ApiTags('export data')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthUserGuard, RoleGuard)
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('candidates')
  async exportCandidates(@Res() res) {
    const candidateData = await this.exportService.exportAllCandidates()
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=candidates.xlsx');
    res.send(candidateData);
  }

  @Get('recruiters')
  async exportRecruiters(@Res() res) {
    const recruiterData = await this.exportService.exportAllRecruiters()
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=recruiters.xlsx');
    res.send(recruiterData);
  }

  @Get('job-list')
  async jobApply(@Res() res) {
    const recruiterData = await this.exportService.exportCandidateAppliedJob()
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=jobList.xlsx');
    res.send(recruiterData);
  }

}
