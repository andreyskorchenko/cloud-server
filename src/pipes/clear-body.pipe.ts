import { Injectable, PipeTransform } from '@nestjs/common';
import * as striptags from 'striptags';

type Body = Record<string, string>;

@Injectable()
export class ClearBodyPipe implements PipeTransform {
    transform(value: Body) {
        const body: Body = {};
        for (const key in value) {
            body[key] = striptags(value[key]).trim();
        }

        return body;
    }
}
