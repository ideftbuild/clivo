import { Module } from "@nestjs/common";
import { VideoController } from "./controller/video.controller";
import { VideoCutService } from "./service/video-cut.service";

@Module({
  controllers: [VideoController],
  providers: [VideoCutService],
})
export class VideoModule {}
