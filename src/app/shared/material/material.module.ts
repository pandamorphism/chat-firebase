import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {ScrollingModule} from '@angular/cdk/scrolling';

const usedMaterialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatTooltipModule,
  ScrollingModule
];

@NgModule({
  declarations: [],
  imports: usedMaterialModules,
  exports: usedMaterialModules,
})
export class MaterialModule { }
