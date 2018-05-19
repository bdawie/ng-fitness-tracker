import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

  startNewTraining: Boolean = false;

  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exerciseStarted.subscribe(result => {
      this.startNewTraining = result;
    });
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}
