import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { CreateResidentWithMedicalDto } from './dto/CreateResidentWithMedicalDto';
import { UpdateResidentDto } from './dto/update-resident.dto';

@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  // --- Lấy tất cả cư dân ---
  @Get()
  findAll() {
    return this.residentsService.findAll();
  }

  // --- Lấy 1 cư dân theo id ---
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(+id);
  }

  // --- Tạo cư dân mới + hồ sơ y tế ---
  @Post('create')
  createWithMedical(@Body() createDto: CreateResidentWithMedicalDto) {
    return this.residentsService.createWithMedical(createDto);
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
