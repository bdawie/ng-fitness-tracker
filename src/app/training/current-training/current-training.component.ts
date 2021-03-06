import { TrainingService } from './../training.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer;
  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.startOrResumeTraining();
  }

  startOrResumeTraining() {
    this.store.select(fromTraining.getRunningExercise).pipe(take(1)).subscribe(ex => {
      const step = (ex.duration / 100) * 1000;
      this.timer = setInterval(() => {
        this.progress = this.progress + 1;
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    });
  }

  onStopCurrentTraining() {
    clearInterval(this.timer);
    const dialogRef: MatDialogRef<StopTrainingComponent> = this.dialog.open(
      StopTrainingComponent,
      {
        data: {
          progress: this.progress
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTraining();
      }
    });
  }
}
