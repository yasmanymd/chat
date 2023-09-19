export type Response<Type> = {
  status: number;
  message: string;
  data?: Type | null;
  errors?: { [key: string]: any } | null;
}