import * as jwt_decode from "jwt-decode";

export class JwtStore {

  private _authToken: string;
  private _decodedJwt: any;

  constructor(token: string) {
    this._authToken = token;
    this._decodedJwt = undefined;
    if (token) {
      try {
        this._decodedJwt = jwt_decode(token);
      } catch (ex) { }
    }
  }

  get token(): string {
    return this._authToken;
  }

  get decodedJwt(): any {
    return this._decodedJwt;
  }

  get email() :string{
    return this._decodedJwt.authEntry.email;
  }

}
