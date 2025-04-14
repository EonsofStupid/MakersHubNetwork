
export interface ServiceSuccess<T> {
  success: true;
  data: T;
}

export interface ServiceError {
  success: false;
  error: string;
}

export type ServiceResponse<T> = ServiceSuccess<T> | ServiceError;

// Type guard to check if the response is successful
export function isSuccessResponse<T>(response: ServiceResponse<T>): response is ServiceSuccess<T> {
  return response.success === true;
}

// Type guard to check if the response is an error
export function isErrorResponse<T>(response: ServiceResponse<T>): response is ServiceError {
  return response.success === false;
}
