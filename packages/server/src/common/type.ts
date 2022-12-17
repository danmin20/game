export interface JwtPayload {
  sub: string;
  email: string;
}

export interface GoogleUser {
  provider: string;
  providerId: string;
  email: string;
  name: string;
}
