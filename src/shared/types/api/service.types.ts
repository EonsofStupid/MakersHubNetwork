
export interface ServiceSuccess<T> {
  success: true;
  data: T;
}

export interface ServiceError {
  success: false;
  error: string;
}

export type ServiceResponse<T> = ServiceSuccess<T> | ServiceError;
