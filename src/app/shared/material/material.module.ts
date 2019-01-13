import {NgModule} from '@angular/core';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';

const usedMaterialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule
];

@NgModule({
  declarations: [],
  imports: usedMaterialModules,
  exports: usedMaterialModules,
})
export class MaterialModule { }
