import {Component, ElementRef, HostListener} from '@angular/core';
import {IHeaderParams} from 'ag-grid/main';
import {IHeaderAngularComp} from 'ag-grid-angular/main';

interface MyParams extends IHeaderParams {
    menuIcon: string;
}

/*
    This component provides custom header interface.
*/

@Component({
    template: `<div class="custom-header">
                 <div [hidden]="!params.enableMenu" class="customHeaderMenuButton">
                   <i class="material-icons ui-icons" [ngStyle]="{'color': inputActive}">search</i>
                 </div>
                 <input type="text" required class="input-filter" [(ngModel)]="inputData" (keyup)="onMenuClick($event)"
                 (click)="onInputFocus($event)">
                 <span class="highlight"></span>
                 <span class="bar"></span>
                 <label class="ui-label">{{params.displayName | translate }}</label>

                 <i class="material-icons ui-icons clear-icon" *ngIf="close" (click)="clearText()">clear</i>
                 <div [hidden]="!params.enableSorting" class="sorting-button" (click)="onSortRequested($event)">
                   <i class="material-icons ui-icons no-sort" *ngIf="ex">swap_vert</i>
                   <i class="material-icons ui-icons sorting-arrows active" *ngIf="desc">arrow_upward</i>
                   <i class="material-icons ui-icons sorting-arrows active" *ngIf="asc">arrow_downward</i>
                 </div>
                 <div *ngIf="isFilterTypeEnum">
                    <div *ngIf="showEnumList">
                      <ul  class="filter-dropdown" >
                        <li class="filter-dropdown-items" *ngFor="let filterValue of this.params.column.colDef.filterValues"
                        (click)="populateData($event)" >
                          <span>{{filterValue}}</span>
                        </li>
                      </ul>
                    </div>
                 </div>
                </div>
                <style>
                 //Fix Firfox showing red-border although input field has not been focused
                 .custom-header {
                     background-color: transparent;
                 }
                  .custom-header input:invalid,
                  .custom-header input.ng-invalid,
                  .custom-header input:required:invalid,
                  .custom-header input.ng-invalid-required,
                  .custom-header:-moz-ui-invalid:not(output) {
                      box-shadow: none !important;
                      outline: none !important;
                  }
                </style>`
})

export class CustomHeaderComponent implements IHeaderAngularComp {

    public params;
    public asc = false;
    public desc = false;
    public ex = true;
    public close = false;
    public inputData;
    public count = 0;
    public showEnumList = false;
    public isFilterTypeEnum = false;
    public inputActive;

    constructor(private _elementRef: ElementRef) { }

    agInit(params): void {
        this.params = params;

        this.showSortIcons();

        this.params.column.addEventListener('sortChanged', () => {
            this.showSortIcons();
        });

        if (this.params.column.colDef.hasOwnProperty('isFilterEnum') &&
           this.params.column.colDef.isFilterEnum === true) {
           this.isFilterTypeEnum = true;
        }
    }


    // Function to clear the filter text
    clearText() {
        this.inputData = '';
        this.close = false;
        this.onMenuClick('');
        this.inputActive = 'grey';
    }


    // To send filter data and show enum dropdown if exist
    onMenuClick(data) {
        this.close = data;
        this.params.headerGridOption(this.params.column.colId, this.inputData, this.params.filter);
        if (this.inputData) {
            this.close = true;
            this.inputActive = '#03a9f4';
        } else {
            this.close = false;
            this.inputActive = 'grey';
        }
    }


    // This function gets called when user clicks on sort icon
    onSortRequested(event) {
        if (this.count === 0) {
            this.params.setSort('asc', event.shiftKey);
        } else if (this.count === 1) {
            this.params.setSort('desc', event.shiftKey);
        } else if ( this.count === 2) {
            this.params.setSort('', event.shiftKey);
        }
    }


    // Function to populate data in the enum dropdown
    populateData(event) {
        this.inputData = event.srcElement.innerText;
        this.showEnumList = !this.showEnumList;
        this.close = event;
        this.params.headerGridOption(this.params.column.colId, this.inputData, this.params.filter);
    }


    closeEnumMenuIfOpen(event) {
        this.showEnumList = false;
    }

    @HostListener('document:click', ['$event'])
    onWindowClick(event) {
        if (!this._elementRef.nativeElement.contains(event.target)) {
            this.showEnumList = false;
        }
        if (!this.inputData) {
            this.inputActive = 'grey';
        }
    }

    onInputFocus(data) {
        this.inputActive = '#03a9f4';
        if (this.isFilterTypeEnum === true  && data !== '') {
           this.showEnumList = !this.showEnumList;
        }
    }


    // To show the icons for sortable columns
    showSortIcons() {
        if (this.params.column.sort === 'asc') {
            this.count = 1;
            this.desc = true;
            this.ex = false;
            this.asc = false;
        } else if (this.params.column.sort === 'desc') {
            this.count = 2;
            this.asc = true;
            this.desc = false;
            this.ex = false;
        } else if (this.params.column.sort === null) {
            this.count = 0;
            this.asc = false;
            this.ex = true;
            this.desc = false;
        }
    }
}
