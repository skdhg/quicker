import { HttpStatus } from "./constants";

export class HttpException {
  public constructor(
    public message: string | Record<string, unknown> | unknown[],
    public status = HttpStatus.OK
  ) {
    Error.captureStackTrace(this, this.constructor);
  }

  public serialize(): Record<string, unknown> {
    if (typeof this.message === "string")
      return {
        message: this.message,
        status: this.status,
      };

    return {
      ...this.message,
      status: this.status,
    };
  }
}
