import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

// Defining our global state (App state)
export interface State {
  ui: fromUi.State;
  auth: fromAuth.State;
}

// Map the reducer to specific state slice
export const reducers: ActionReducerMap<State> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer
};

export const getUiState = createFeatureSelector<fromUi.State>('ui'); // selects the ui slice state from the store
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading); // selecting the isLoading state

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticated = createSelector(
  getAuthState,
  fromAuth.getIsAuthenticated
);
