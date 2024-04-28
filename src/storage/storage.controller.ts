import { Controller } from '@nestjs/common';
import { StorageService } from '@/storage/storage.service';

@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}
}
