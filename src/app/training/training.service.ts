import { Subject } from 'rxjs';
import { Exercise } from './exercise.model';

export class TrainingService {
  private availableExercises: Exercise[] = [
    {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
    {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
    {id: 'burpess', name: 'Burpess', duration: 60, calories: 8}
  ];

  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  exerciseStarted = new Subject<boolean>();

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseStarted.next(true);
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseStarted.next(false);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
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

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
