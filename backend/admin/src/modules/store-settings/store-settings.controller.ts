import { Controller, Get, Put, Body } from '@nestjs/common';
import { StoreSettingsService } from './store-settings.service';

@Controller('settings')
export class StoreSettingsController {
  constructor(private readonly settingsService: StoreSettingsService) {}

  @Get('profile')
  getProfile() {
    return this.settingsService.getProfile();
  }

  @Put('profile')
  updateProfile(@Body() body: any) {
    return this.settingsService.updateProfile(body);
  }

  @Get('timing')
  getTiming() {
    return this.settingsService.getTiming();
  }

  @Get('contact')
  getContact() {
    return this.settingsService.getContact();
  }

  @Get('policies')
  getPolicies() {
    return this.settingsService.getPolicies();
  }
}
