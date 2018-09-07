import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

import { UIService } from './../shared/ui.service';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseStarted = new Subject<boolean>();
  fetchedExercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  afSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.afSubscriptions.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(documents =>
            documents.map(doc => {
              const data = doc.payload.doc.data() as Exercise;
              const id = doc.payload.doc.id;
              return {
                id,
                name: data.name,
                duration: data.duration,
                calories: data.calories
              };
            })
          )
        )
        .subscribe(
          (fetchedExercises: Exercise[]) => {
            this.store.dispatch(
              new Training.SetAvailableExercises(fetchedExercises)
            );
            this.store.dispatch(new UI.StopLoading());
          },
          err => {
            this.uiService.showSnackBarMessage(
              'Loading Exercises failed, please try again!',
              null,
              3500
            );
            this.store.dispatch(new UI.StopLoading());
            this.fetchedExercisesChanged.next(null);
          }
        )
    );
  }

  startExercise(selectedId: string) {
    // this.db.doc(`availableExercises/${selectedId}`).update({lastSelected: new Date()});
    this.store.dispatch(new Training.StartExercise(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getRunningExercise)
      .pipe(take(1))
      .subscribe(ex => {
        this.saveDataToDatabse({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopExercise());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getRunningExercise)
      .pipe(take(1))
      .subscribe(ex => {
        this.saveDataToDatabse({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopExercise());
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.afSubscriptions.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((finishedExercies: Exercise[]) => {
          this.store.dispatch(
            new Training.SetFinishedExercises(finishedExercies)
          );
        })
    );
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
