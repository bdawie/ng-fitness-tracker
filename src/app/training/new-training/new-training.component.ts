import { Exercise } from './../exercise.model';
import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import { NgForm } from '@angular/forms';
import {Observable} from 'rxjs';

import { TrainingService } from './../training.service';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  availableExercises: Observable<any>;

  constructor(private trainingService: TrainingService, private db: AngularFirestore) { }

  ngOnInit() {
    this.availableExercises = this.db.collection('availableExercises').valueChanges();
  }

  onStartNewTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
