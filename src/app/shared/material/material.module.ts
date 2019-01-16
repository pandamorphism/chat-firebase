import {NgModule} from '@angular/core';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule, MatToolbarModule} from '@angular/material';

const usedMaterialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatSnackBarModule
];

@NgModule({
  declarations: [],
  imports: usedMaterialModules,
  exports: usedMaterialModules,
})
export class MaterialModule { }
