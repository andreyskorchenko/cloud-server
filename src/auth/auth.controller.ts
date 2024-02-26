import { Controller, Post, Req, Res, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    @Post('signin')
    @HttpCode(200)
    signin(@Req() req: Request, @Res() res: Response) {
        console.log(req.body);
        res.end('signin');
    }

    @Post('signup')
    signup(@Req() req: Request, @Res() res: Response) {
        console.log(req.body);
        res.end('signup');
    }
}
