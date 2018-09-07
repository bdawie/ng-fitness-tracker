import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIService {
  constructor(private snackBar: MatSnackBar) {}
  showSnackBarMessage(message, action, duration) {
    this.snackBar.open(message, action, { duration });
  }
}
