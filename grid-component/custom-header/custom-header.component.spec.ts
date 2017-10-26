import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule} from 'ag-grid-angular/main';
import {By} from '@angular/platform-browser';
import { CustomHeaderComponent } from './custom-header.component';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

describe('CustomHeaderComponent', () => {
  let component: CustomHeaderComponent;
  let fixture: ComponentFixture<CustomHeaderComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomHeaderComponent ],
      imports: [
        FormsModule,
            AgGridModule.withComponents([CustomHeaderComponent]),
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomHeaderComponent);
    component = fixture.componentInstance;
    component['params'] = {'enableMenu': false, 'displayName': 'HeaderName'};
  //  component['isFilterTypeEnum'] = true;
  //  component['showEnumList'] = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify the input label name', () => {
    de = fixture.debugElement.query(By.css('label'));
    el = de.nativeElement.innerText;
    expect(component['params']['displayName']).toEqual(el);
  });

});
