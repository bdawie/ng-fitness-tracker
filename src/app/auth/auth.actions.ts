import { Action } from '@ngrx/store';

export const AUTHENTICATED = '[AUTH] Authenticated';
export const NOT_AUTHENTICATED = '[AUTH Not Authenticated]';

export class Authenticated implements Action {
  readonly type = AUTHENTICATED;
}

export class NotAuthenticated {
  readonly type = NOT_AUTHENTICATED;
}

export type AuthActions = Authenticated | NotAuthenticated;
