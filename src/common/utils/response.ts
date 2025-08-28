import { HttpStatus } from "@nestjs/common";

export class Response {

  readonly statusCode: number;

  readonly message: string;

  readonly data: unknown;

  constructor(statusCode: number, message: string, data?: unknown) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || null;
  }
}