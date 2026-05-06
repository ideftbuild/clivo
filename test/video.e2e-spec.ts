import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { VideoModule } from "./../src/split/video.module";

type SplitResponse = {
  success: boolean;
  clips: string[];
};

describe("VideoController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [VideoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (POST)", () => {
    return request(app.getHttpServer())
      .post("/video/split")
      .send({
        input: "upload/Whatsapp_story_post.mp4",
        interval: 10,
        totalDuration: 14,
      })
      .expect(201)
      .expect((res: { body: SplitResponse }) => {
        if (res.body.success !== true) {
          throw new Error("success should be true");
        }

        if (!Array.isArray(res.body.clips)) {
          throw new Error("clips should be an array");
        }

        if (res.body.clips.length !== 2) {
          throw new Error("expected 2 clips");
        }
      });
  });

  afterEach(async () => {
    await app.close();
  });

  jest.setTimeout(30000);
});
