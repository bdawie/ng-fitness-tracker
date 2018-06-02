import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { UIService } from './../../shared/ui.service';
import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  availableExercises: Exercise[];
  isLoading = true;
  exercisesSubscription: Subscription;
  loadingStateSubscription: Subscription;
  constructor(private trainingService: TrainingService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingStateSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.exercisesSubscription = this.trainingService.fetchedExercisesChanged.subscribe(
      exercies => {
        this.availableExercises = exercies;
      }
    );
    this.fetchAvailableExercises();
  }

  fetchAvailableExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartNewTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
    if (this.loadingStateSubscription) {
      this.loadingStateSubscription.unsubscribe();
    }
  }
}
