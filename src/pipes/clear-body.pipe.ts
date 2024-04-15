import { Injectable, PipeTransform } from '@nestjs/common';
import * as striptags from 'striptags';

@Injectable()
export class ClearBodyPipe implements PipeTransform {
    transform(body: Record<string, string>) {
        return Object.entries(body).reduce((acc, [key, value]) => {
            return { ...acc, [key]: striptags(value).trim() };
        }, {});
    }
}
