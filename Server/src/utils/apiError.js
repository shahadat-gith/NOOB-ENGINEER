// Throw this anywhere in services/controllers to return a clean JSON error:
// { message: "...", status: 409 }
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
