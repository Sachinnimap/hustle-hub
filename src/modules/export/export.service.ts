import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workbook } from 'exceljs';
import { AuthService } from '../auth/auth.service';
import { JobApplyService } from '../job-apply/job-apply.service';

@Injectable()
export class ExportService {
constructor(
    // @InjectModel(Job) private jobModel : typeof Job,@InjectModel(Job) private jobModel : typeof Job
    private authService :AuthService,
    private jobApplyService :JobApplyService
){}

async exportAllCandidates(){
    const candidates = await this.authService.getAllCandidates({pageNo:1,limit:100})
    // const  plainData = candidates.candidates.map(c => c.get({ plain: true }))
    // console.log('plaine',plainData)
    const data = await this.exportToExcel(
      candidates.candidates,
      'Candidates',
      [
        { header: 'Name', key: 'name' },
        { header: 'mobile', key: 'mobile' },
        { header: 'Email', key: 'email' },
      ],
    );
    return data;
}

async exportAllRecruiters(){
    const result = await this.authService.getAllRecruiters({pageNo:1,limit:100})
    // const  plainData = result.recruiters.map(c => c.get({ plain: true }))
    const data = await this.exportToExcel(
      result.recruiters,
      'Recruiters',
      [
        { header: 'Name', key: 'name' },
        { header: 'mobile', key: 'mobile' },
        { header: 'Email', key: 'email' },
      ],
    );
    return data;
}

async exportCandidateAppliedJob(){
    const result = await this.jobApplyService.findAll({pageNo:1,limit:100})
    const data = await this.exportToExcel(
      result.data,
      'Candidate_Applied_Jobs',
      [
        { header: 'Candidate', key: 'candidate' },
        { header: 'Applied For ', key: 'appliedFor' },
        { header: 'Apply Date', key: 'createdAt' },
      ],
    );
    return data;
}

  async exportToExcel(data: any[], sheetName: string, columns: any[]) {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    sheet.columns = columns;
    sheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
