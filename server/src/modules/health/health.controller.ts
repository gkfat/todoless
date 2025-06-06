import {
    Controller,
    Get,
} from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private readonly healthService: HealthCheckService,
    ) {}

    @Get()
    @HealthCheck()
    async check() {
        return this.healthService.check([]);
    }
}
