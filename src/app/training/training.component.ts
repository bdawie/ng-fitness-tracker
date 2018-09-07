import { Observable } from 'rxjs';
import { TrainingService } from './training.service';
import { Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  startNewTraining$: Observable<boolean>;


  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.startNewTraining$ = this.store.select(fromTraining.getIsTraining);
  }
}
