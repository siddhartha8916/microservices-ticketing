import { ValidationError } from "express-validator";
import { CustomError } from "./abstract-custom-error";

export class RequestValidationError extends CustomError {
  errors: ValidationError[];
  statusCode = 400;

  constructor(errors: ValidationError[]) {
    super("Request Body Validation Error");
    this.errors = errors;

    // Only as we are extending a built in class in typescript
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const formattedError = this.errors.map((error) => {
      if (error.type === "field") {
        return { message: error.msg, field: error.path };
      }
      return { message: error.msg, field: "" };
    });

    return formattedError;
  }
}
