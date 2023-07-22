import { z } from "zod";
import { DatabaseType } from "./constants";

export const GenerateRouteSchema = z.object({
  url: z.string().url(),
  type: z.enum([DatabaseType.Mongodb]),
});
