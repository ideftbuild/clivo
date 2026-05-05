import { Injectable, OnModuleInit } from "@nestjs/common";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class VideoCutService implements OnModuleInit {
  onModuleInit() {
    console.log("control in constructor");
    const uploadPath = path.join(process.cwd(), "upload");
    console.log("upload path: ", uploadPath);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  cut(
    input: string,
    start: number,
    duration: number,
    output: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const cmd = `ffmpeg -i "${input}" -ss ${start} -t ${duration} "${output}"`;

      exec(cmd, (err) => {
        if (err) return reject(err);
        resolve(output);
      });
    });
  }

  async split(
    input: string,
    interval: number,
    totalDuration: number,
  ): Promise<string[]> {
    const tasks: Promise<string>[] = [];

    for (let start = 0; start < totalDuration; start += interval) {
      const output = `./upload/clip_${start}.mp4`;

      tasks.push(this.cut(input, start, interval, output));
    }

    return Promise.all(tasks);
  }
}
