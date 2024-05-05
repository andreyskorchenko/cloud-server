import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import Handlebars from 'handlebars';

@Injectable()
export class TemplatesService {
    async compile(template: string) {
        const hbs = await readFile(join(process.cwd(), `src/templates/hbs/${template}.hbs`));
        return Handlebars.compile(hbs.toString());
    }
}
