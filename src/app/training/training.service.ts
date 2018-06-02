import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { UIService } from './../shared/ui.service';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private exercises: Exercise[] = [];

  private runningExercise: Exercise;

  exerciseStarted = new Subject<boolean>();
  fetchedExercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  afSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {}

  fetchAvailableExercises() {
    this.afSubscriptions.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(documents => documents.map(doc => {
          const data = doc.payload.doc.data() as Exercise;
          const id = doc.payload.doc.id;
          return {
            id,
            name: data.name,
            duration: data.duration,
            calories: data.calories
          };
        }))
      )
      .subscribe((fetchedExercises: Exercise[]) => {
        this.availableExercises = fetchedExercises;
        this.fetchedExercisesChanged.next([...this.availableExercises]);
        this.uiService.loadingStateChanged.next(false);
      }, err => {
        this.uiService.showSnackBarMessage('Loading Exercises failed, please try again!', null, 3500);
        this.uiService.loadingStateChanged.next(false);
        this.fetchedExercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string) {
    // this.db.doc(`availableExercises/${selectedId}`).update({lastSelected: new Date()});

    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseStarted.next(true);
  }

  completeExercise() {
    this.saveDataToDatabse({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseStarted.next(false);
  }

  cancelExercise(progress: number) {
    this.saveDataToDatabse({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseStarted.next(false);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercises() {
    this.afSubscriptions.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((finishedExercies: Exercise[]) => {
        this.exercises = finishedExercies;
        this.finishedExercisesChanged.next([...this.exercises]);
      }));
  }

  cancelSubscriptions() {
    for (const sub of this.afSubscriptions) {
      sub.unsubscribe();
    }
  }

  private saveDataToDatabse(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
