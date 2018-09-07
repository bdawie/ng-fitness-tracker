import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';
import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  availableExercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;
  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.availableExercises$ = this.store.select(
      fromTraining.getAvailableExercises
    );
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.fetchAvailableExercises();
  }

  fetchAvailableExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartNewTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
