import { Body, Controller, Post } from "@nestjs/common";
import { SplitVideoDto } from "../dto/split-video.dto";
import { VideoCutService } from "../service/video-cut.service";

@Controller("video")
export class VideoController {
  constructor(private readonly videoCut: VideoCutService) {}

  @Post("split")
  async splitVideo(@Body() body: SplitVideoDto) {
    const { input, interval, totalDuration } = body;

    const clips = await this.videoCut.split(input, interval, totalDuration);

    return {
      success: true,
      clips,
    };
  }
}
