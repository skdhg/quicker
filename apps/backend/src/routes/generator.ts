import { Router } from "express";
import { GenerateRouteSchema } from "../utils/schema";
import { generateStructure } from "../database/generateStructure";
import { HttpException } from "../utils/HttpException";
import { HttpStatus } from "../utils/constants";

const router = Router();

router.post("/generate", async (req, res, next) => {
  try {
    const { url, type } = await GenerateRouteSchema.parseAsync(req.body);

    const structure = await generateStructure(url, type);

    throw new HttpException({ structure }, HttpStatus.OK);
  } catch (e) {
    next(e);
  }
});

export default router;
