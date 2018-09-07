import {Action, createFeatureSelector, createSelector} from '@ngrx/store';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import { TrainingActions, SET_AVAILABLE_EXERCISES, SET_FINISHED_EXERCISES, START_EXERCISE, STOP_EXERCISE } from './training.actions';

export interface TrainingState {
    availableExercises: Exercise[];
    finishedExercises: Exercise[];
    runningExercise: Exercise;
}
// new global state, due to lazy loading.
export interface State extends fromRoot.State {
    training: TrainingState;
}

export const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises: [],
    runningExercise: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
    switch (action.type) {
        case SET_AVAILABLE_EXERCISES:
            return {
                ...state,
                availableExercises: action.payload
            };
        case SET_FINISHED_EXERCISES:
            return {
                ...state,
                finishedExercises: action.payload
            };
        case START_EXERCISE:
            return {
                ...state,
                runningExercise: {...state.availableExercises.find(ex => ex.id === action.payload)}
            };
        case STOP_EXERCISE:
            return {
                ...state,
                runningExercise: null
            };
        default:
            return state;

    }
}



export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableExercises = createSelector(getTrainingState , (state: TrainingState) => state.availableExercises);
export const getFinishedExercises =  createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getRunningExercise = createSelector(getTrainingState, (state: TrainingState) => state.runningExercise);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.runningExercise != null);




