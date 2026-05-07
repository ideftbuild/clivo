import { Body, Controller, Post } from "@nestjs/common";
import { SplitVideoDto } from "../dto/split-video.dto";
import { VideoCutService } from "../service/video-cut.service";
import { Req } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { pipeline } from "stream/promises";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

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

  @Post("upload")
  async upload(@Req() req: FastifyRequest) {
    const data = await req.file();

    if (!data) {
      return { message: "No file uploaded" };
    }

    const fileId = randomUUID();
    const ext = path.extname(data.filename);
    const fileName = `${fileId}${ext}`;

    const uploadPath = path.join(process.cwd(), "uploads", fileName);

    await pipeline(data.file, fs.createWriteStream(uploadPath));

    return {
      fileId: fileName,
      path: uploadPath,
    };
  }
}
