import { Request } from 'express';
import { createHash } from 'node:crypto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';

export const Fingerprint = createParamDecorator((_, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest<Request>();
    const ua = headers['user-agent'];

    if (!ua?.length) {
        return null;
    }

    const { device, os, browser } = UAParser(ua);
    const deviceInfo = [device.vendor, device.model, os.name, os.version, browser.name].reduce((acc, item) => {
        if (!item?.length) {
            return acc;
        }

        return [...acc, item.toLowerCase().replace(/\s/g, '')];
    }, []);

    if (!deviceInfo?.length) {
        return null;
    }

    return createHash('sha256').update(deviceInfo.join('.')).digest('hex');
});
