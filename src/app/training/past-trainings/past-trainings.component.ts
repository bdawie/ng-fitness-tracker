import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {

  columnsToDisplay = ['date', 'name', 'calories', 'duration', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  finishedExerciesSubscription: Subscription;
  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.finishedExerciesSubscription = this.trainingService.finishedExercisesChanged
      .subscribe(finishedExercies => {
        this.dataSource.data = finishedExercies;
      });
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterString: string) {
    this.dataSource.filter = filterString.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.finishedExerciesSubscription) {
      this.finishedExerciesSubscription.unsubscribe();
    }
  }

}
