import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule} from 'ag-grid-angular/main';
import { UiGridComponent } from './grid.component';
import { NameCellChangeComponent } from './name-cell-change/name-cell-change.component';
import { SingleActionMenuComponent } from './single-action-menu/single-action-menu.component';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { ClickOutsideDirective } from './click-outside.directive';
import {ToggleRendererComponent} from './toggle-renderer/toggle-renderer.component';
import {MaterialModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    UiGridComponent,
    NameCellChangeComponent,
    SingleActionMenuComponent,
    CustomHeaderComponent,
    ClickOutsideDirective,
    ToggleRendererComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    AgGridModule.withComponents([
      NameCellChangeComponent,
      SingleActionMenuComponent,
      CustomHeaderComponent,
      ToggleRendererComponent
    ]),
    TranslateModule
  ],
  exports: [UiGridComponent]
})

export class UiGridModule { }
