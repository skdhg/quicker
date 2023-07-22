import "dotenv/config";
import express from "express";
import { HttpStatus } from "./utils/constants";
import { HttpException } from "./utils/HttpException";
import { ZodError } from "zod";
import cors from 'cors';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  "/api",
  require("./routes/generator")
    .default as typeof import("./routes/generator").default
);

app.all("*", () => {
  throw new HttpException("route not found", HttpStatus.NOT_FOUND);
});

app.use(
  (
    err: HttpException | Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (res.headersSent) return next(err);

    const isHttpException = err instanceof HttpException;
    if (!isHttpException) {
      if (err instanceof ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: err.message,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message || "Internal server error",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } else {
      const serializedError = err.serialize();
      return res.status(err.status).json(serializedError);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
