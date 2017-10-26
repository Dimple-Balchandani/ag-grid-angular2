import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule} from 'ag-grid-angular/main';
import {By} from '@angular/platform-browser';
import { SingleActionMenuComponent } from './single-action-menu.component';
import { DebugElement } from '@angular/core';

describe('SingleActionMenuComponent', () => {
  // let component: SingleActionMenuComponent;
  // let fixture: ComponentFixture<SingleActionMenuComponent>;
  // let de:      DebugElement;
  // let el:      HTMLElement;
  //
  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SingleActionMenuComponent ],
  //     imports: [
  //           AgGridModule.withComponents([SingleActionMenuComponent])
  //     ]
  //   })
  //   .compileComponents();
  // }));
  //
  // beforeEach(() => {
  //   fixture = TestBed.createComponent(SingleActionMenuComponent);
  //   component = fixture.componentInstance;
  //   component['isSingleActionVisible'] = true;
  //   component['actions'] = {'colDef': {'singleMenuActionItems': [{'actionName': 'Action1', 'icon': 'testIcon'}]}};
  //   fixture.detectChanges();
  // });
  //
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  //
  // it('test showRowMenu method ', () => {
  //   component.showRowMenu();
  //   expect(component.isSingleActionVisible).toEqual(false);
  // });
  //
  // it('should populate action name', () => {
  //   de = fixture.debugElement.query(By.css('span'));
  //   el = de.nativeElement.innerText;
  //   expect(component['actions']['colDef']['singleMenuActionItems'][0]['icon']).toEqual(el);
  // });
});
