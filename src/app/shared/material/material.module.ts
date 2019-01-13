import {NgModule} from '@angular/core';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';

const usedMaterialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule
];

@NgModule({
  declarations: [],
  imports: usedMaterialModules,
  exports: usedMaterialModules,
})
export class MaterialModule { }
