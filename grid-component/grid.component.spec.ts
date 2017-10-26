import { TestBed, async } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular/main';
import { UiGridComponent } from './grid.component';
import { NameCellChangeComponent } from './name-cell-change/name-cell-change.component';
import { SingleActionMenuComponent } from './single-action-menu/single-action-menu.component';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MockComponent} from 'ng2-mock-component';

describe('UiGridComponent', () => {
  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [
  //       UiGridComponent,
  //       MockComponent({
  //         selector: 'app-name-cell-change'
  //       }),
  //       MockComponent({
  //         selector: 'app-single-action-menu'
  //       }),
  //       CustomHeaderComponent
  //     ],
  //     imports: [
  //       CommonModule,
  //       FormsModule,
  //       AgGridModule.withComponents(CustomHeaderComponent)
  //     ],
  //   }).compileComponents();
  // }));
  //
  // it('should create the app', async(() => {
  //   const fixture = TestBed.createComponent(UiGridComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   app['dataSource'] = 'some data';
  //   expect(app).toBeTruthy();
  // }));
});
