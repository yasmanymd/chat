export interface IResponse<Type> {
  status: number;
  message: string;
  data?: Type | null;
  errors?: { [key: string]: any } | null;
}