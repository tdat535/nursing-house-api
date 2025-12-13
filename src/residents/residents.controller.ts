import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { CreateResidentWithMedicalDto } from './dto/CreateResidentWithMedicalDto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { OutResidentDto } from './dto/out-resident.dto';

@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  // --- Lấy tất cả cư dân ---
  @Get()
  findAll() {
    console.log('Getting all residents');
    return this.residentsService.findAll();
  }

  // --- Lấy tất cả dịch vụ của cư dân ---
  @Get('all-services')
  getAllResidentServices() {
    console.log('Getting all resident services');
    return this.residentsService.getAllResidentServices();
  }

  // --- Tạo cư dân mới + hồ sơ y tế ---
  @Post('create')
  createWithMedical(@Body() createDto: CreateResidentWithMedicalDto) {
    return this.residentsService.createWithMedical(createDto);
  }

  // --- Thêm dịch vụ cho cư dân ---
  @Post(':id/services')
  addServices(
    @Param('id') residentId: string,
    @Body() body: { serviceIds: number[] },
  ) {
    return this.residentsService.addServices(Number(residentId), body.serviceIds);
  }

  // --- Lấy 1 cư dân theo id ---
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(+id);
  }

  @Patch('discharge')
  async outResident(@Body() dto: OutResidentDto) {
    console.log('Processing resident discharge:', dto);
    return {
      success: true,
      data: await this.residentsService.outResident(dto),
      message: 'Cư dân đã ra viện và giường đã được giải phóng',
    };
  }

  // --- Cập nhật cư dân ---
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateResidentDto) {
    return this.residentsService.update(+id, updateDto);
  }

  

  // --- Xóa cư dân ---
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residentsService.remove(+id);
  }

  
}
