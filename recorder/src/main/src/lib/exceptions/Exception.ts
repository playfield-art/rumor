/**
 * A wrapper around error handling
 */

import { IError } from "@shared/interfaces";

export class Exception extends Error {
  public error: IError;

  constructor(error: IError) {
    super(error.message);
    this.error = error;
  }
}
