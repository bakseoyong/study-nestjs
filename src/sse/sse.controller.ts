import { Controller, Get, Render, Req, Sse, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('sse')
export class SseController {
  @Get()
  @Render('sse.ejs')
  testSse(): any {
    return 0;
  }

  @Get('/login')
  @UseGuards(JwtAuthGuard)
  sseLogin(@Req() req): any {
    return req.user.no;
  }

  // @Sse('/subscribe')
  // subscribe();
}
