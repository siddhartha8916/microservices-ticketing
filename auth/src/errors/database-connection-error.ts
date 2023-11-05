import { CustomError } from "./abstract-custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "";
  statusCode = 500;

  constructor(reason?: string) {
    super("Error Connecting to Database");

    if (reason) {
      this.reason = reason;
    } else {
      this.reason = "Error Connecting to Database";
    }

    // Only as we are extending a built in class in typescript
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
