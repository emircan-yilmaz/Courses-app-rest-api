import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SectionService } from '../sections/sections.service';

@Injectable()
export class VideosGuard implements CanActivate {
  constructor(private sectionService: SectionService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const { videoId, sectionId } = req.params;

    const section = await this.sectionService.getSection(sectionId);
    const index = section.contents.findIndex(
      (el) => el.ref_id.toString() === videoId.toString(),
    );

    if (index === -1) return false;

    return true;
  }
}
