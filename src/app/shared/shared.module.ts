import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './../material.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class SharedModule { }
