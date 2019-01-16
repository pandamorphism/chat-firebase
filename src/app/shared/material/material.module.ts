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

const usedMaterialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatTooltipModule
];

@NgModule({
  declarations: [],
  imports: usedMaterialModules,
  exports: usedMaterialModules,
})
export class MaterialModule { }
