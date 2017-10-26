import {
  Component, ViewEncapsulation, Input, OnChanges, AfterViewChecked,
  ElementRef, NgZone, Output, EventEmitter, HostListener, OnInit, AfterViewInit, OnDestroy
} from '@angular/core';
import {GridOptions, RowNode} from 'ag-grid';
import { NameCellChangeComponent } from './name-cell-change/name-cell-change.component';
import { SingleActionMenuComponent } from './single-action-menu/single-action-menu.component';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { ClickOutsideDirective } from './click-outside.directive';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

/*
    Main Grid component where all the grid properties and functions are defined.
*/

@Component({
    selector: 'ai-advanced-data-grid',

    encapsulation: ViewEncapsulation.None,

    template: `<div class="grid-content">
                  <div class="grid-header" *ngIf="showHeader">
                      <div *ngIf="!isRowSelected" class="select-items">{{gridTitle}}</div>
                      <div *ngIf="isRowSelected" class="items-selected">
                          <div class="row-count">{{selectedRowCount}} {{localeText.ITEMS_SELECTED_KEY}} </div>
                          <div class="multi-action-menu" (clickOutside)="isHeaderMenuVisible = false">
                              <div *ngIf="isMoreThanTwoHeaderActions" class="action-content">
                                  <button (click)="showActions()" class="ui-btn action-button">
                                      ACTIONS<i class="material-icons ui-icons down-icon">arrow_drop_down</i>
                                  </button>
                                  <ul *ngIf="isHeaderMenuVisible" class="dropdown">
                                    <li *ngFor="let action of remainingheaderAction" class="ui-btn menu-buttons"
                                    (click)="customEvent($event, action, listOfSelectedNodes)">
                                      <span class="single-action-icon" [innerHTML]= "action.icon"></span>
                                      <span>{{action.actionName}} </span>
                                    </li>
                                  </ul>
                              </div>
                              <button *ngIf="headerActionFirst" class="ui-btn action-button"
                              (click)="customEvent($event,headerActionFirst,listOfSelectedNodes)">
                                <span class="single-action-icon" [innerHTML]= "headerActionFirst.icon"></span>
                                <span>{{headerActionFirst.actionName}} </span>
                              </button>
                              <button *ngIf="headerActionSecond" class="ui-btn action-button"
                              (click)="customEvent($event,headerActionSecond,listOfSelectedNodes)">
                                <span class="single-action-icon" [innerHTML]= "headerActionSecond.icon"></span>
                                <span>{{headerActionSecond.actionName}} </span>
                              </button>
                          </div>
                      </div>
                  </div>

                  <div class="card-content">
                      <div class="progress-bar" *ngIf="isLoaded"></div>
                      <div class="progress-bar-filled" [ngStyle]="{width:loadProgress+'%'}" *ngIf="isLoaded"></div>
                      <ag-grid-angular #agGrid style="width: 100%; min-height: 456px; height: 100%;" class="ag-material"
                          [gridOptions]="finalGridOptions"
                          [columnDefs]="columnDefs"
                          rowSelection="multiple"
                          (selectionChanged)="onSelectionChanged($event)"
                          (rowSelected)="onRowSelected($event)">
                      </ag-grid-angular>
                  </div>
                  <div class="pagination-footer">
                      <div class="rows-per-page" *ngIf="showRowsPerPageChangeOption && endRow">
                          <span>{{localeText.ROWS_PER_PAGE}}</span>
                          <md-select [(ngModel)]="selectedRowsPerPage" (change)="selectedRowsPerPageChange($event)">
                            <md-option *ngFor="let rowOption of rowsPerPageOptions" [value]="rowOption">
                              {{ rowOption }}
                            </md-option>
                          </md-select>
                      </div>
                      <!--<div class="display-pages">-->
                          <!--{{paginationTitle}} {{localeText.PAGE_KEY}} <span class="bold-text">{{currentPage}}</span>-->
                          <!--{{localeText.OF_KEY}} <span class="bold-text">{{totalPages}}</span>-->
                      <!--</div>-->
                      <div class="display-rows" *ngIf="endRow">
                          <span class="bold-text">{{startRow}}</span> - <span class="bold-text">{{endRow}}</span>
                          of <span class="bold-text">{{totalRows}}</span> {{paginationTitle}}
                      </div>
                      <div class=footer-controls *ngIf="endRow">
                           <div class="ui-btn previous" (click)="onPreviousClick()" [ngStyle]="{'pointer-events':isFirstDisabled}">
                             <i class="material-icons ui-icons navigate" [ngStyle]="{'color': isFirstPage}" >navigate_before</i>
                           </div>
                           <div class="ui-btn next" (click)="onNextClick()" [ngStyle]="{'pointer-events':isLastDisabled}">
                             <i class="material-icons ui-icons navigate" [ngStyle]="{'color': isLastPage}" >navigate_next</i>
                           </div>
                      </div>
                  </div>
              </div>

              <style>

                  .ui-btn {
                      position: relative;
                      border: none;
                      overflow: hidden;
                      z-index: 2;
                      text-transform: uppercase;
                      transition: box-shadow 0.1s, background-color 0.2s, color 0.2s;
                      transition-delay: 0.1s;
                      -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
                      box-shadow: none;
                      border-radius: 2px;
                      font-weight: bold;
                      letter-spacing: 0.025em;
                      padding: 8px 20px;
                      line-height: 20px;
                      background-color: transparent;
                      cursor: pointer;
                  }

                  .ui-btn:focus {
                      outline : none;
                  }

                  .dropdown {
                      display: inline-block;
                      width: 150px;
                      position: absolute;
                      background: white;
                      z-index: 100;
                      top: 45px;
                      padding: 5px 0;
                      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
                  }

                  .input-filter {
                      width: 100%;
                      float: left;
                      font-size: 15px;
                      border: none;
                      outline: none;
                      background: transparent;
                  }

                  .action-content {
                      display: inline-block;
                  }

                  .actions:hover {
                      background-color: #f1f1f1
                  }

                  .ui-btn: hover {
                      background-color: grey;
                  }

                  .action-button {
                      color: #03a9f4;
                      font-size: 15px;
                  }

                  .pagination-footer {
                      float: right;
                      display: flex;
                      width: 100%;
                      justify-content: flex-end;
                      padding: 18px 0 13px 30px;
                      font-size: 14px;
                      color: #9E9E9E;
                      font-family: Roboto,"Helvetica Neue",sans-serif !important;
                      border-top: 1px solid #EEEEEE;
                  }

                  .display-pages {
                      float: left;
                  }
                  .rows-per-page {
                    display: inline-block;
                    margin-right: 39px;
                  }
                  .rows-per-page > .mat-select {
                    padding: 0;
                    margin: 0;
                    position: relative;
                    bottom: 5px;
                  }

                  .display-rows {
                      margin-left: 20px;
                  }

                  .footer-controls {
                      display: inline-block;
                      margin: 0 40px;
                  }

                  .bold-text {
                      color: #666;
                  }

                  .ui-btn.previous {
                      float: left;
                      top: -5px;
                      position: relative;
                      padding: 0;
                  }

                  .ui-icons {
                      font-size: 20px;
                      color: grey;
                  }

                  .ui-btn.next {
                      float: right;
                      top: -5px;
                      position: relative;
                      padding: 0;
                      margin-left: 40px;
                  }

                  .cur-page {
                      background-color: #f4f4f4;
                      float: left;
                      margin: -10px 10px;
                      padding: 10px 15px;
                  }

                  .grid-content {
                      margin: 0px !important;
                      padding: 0px !important;
                      display: inline-block;
                      box-shadow: 0 2px 2px 0 rgba(0,0,0,.24), 0 0 4px 0 rgba(0,0,0,.12);
                      background: white;
                      font-family: Roboto,"Helvetica Neue",sans-serif !important;
                      width: 100%;
                  }

                  .navigate {
                      color: #999;
                  }

                  .menu-buttons {
                      font-size: 16px;
                      font-weight: 100;
                  }

                  .menu-buttons:hover {
                      background-color: #f1f1f1
                  }

                  .filter-dropdown-items:hover {
                      background-color: #f1f1f1
                  }

                  .card-content {
                      height: 540px;
                      position: relative;
                  }

                  .items-selected {
                      background: #def3fe;
                      height: 24px;
                      padding: 20px;
                      font-size: 20px;
                      color: #666;
                  }

                  .actions {
                      height: 20px;
                      padding: 10px;
                      cursor: pointer;
                  }

                  .row-count {
                      float: left;
                  }

                  .multi-action-menu {
                      float: right;
                      margin-top: -10px;
                  }

                  .select-items {
                      height: 24px;
                      padding: 20px;
                      font-size: 20px;
                      color: #666;
                  }

                  .progress-bar {
                      position: absolute;
                      z-index: 100;
                      margin-top: 50px;
                      height: 4px;
                      background-color: #b6e6ea;
                      width: 100%;
                  }

                   .progress-bar-filled {
                      position: absolute;
                      z-index: 1000;
                      margin-top: 50px;
                      height: 4px;
                      background-color: #03a9f4;
                      min-width: 99%;
                  }

                  .ag-header-cell-label {
                      color: #bebebe;
                  }

                  .ag-cell-focus {
                      border: none;
                      outline: none;
                  }

                  .ag-header-group-cell {
                    text-align: center;
                  }

                  .dropdown-content {
                      display: inline-block;
                      min-width: 140px;
                      position: absolute;
                      background: white;
                      z-index: 100;
                      top: 15px;
                      padding: 5px 0;
                      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
                      left: -85px;
                  }

                  .single-action-icon {
                      vertical-align: sub;
                  }

                  .ag-material {
                      font-family: Roboto,"Helvetica Neue",sans-serif !important;
                      font-size: 13px !important;
                  }

                  .ag-header-cell-menu-button {
                      float: left !important;
                  }

                  .ag-sort-ascending-icon {
                      float: right;
                      margin-right: 160px;
                  }

                  .ag-sort-descending-icon {
                      float: right;
                      margin-right: 160px;
                  }

                  #south{
                      margin-top: 50px;
                  }

                  .active {
                      color: black;
                  }

                  .hidden {
                      display:none;
                  }

                  .ag-header-row {
                      top: 15px !important;
                  }

                  .ag-body {
                      top: 50px !important;
                      padding-bottom: 10px;
                      font-family: Roboto,"Helvetica Neue",sans-serif !important;
                      min-height: 456px  !important;
                  }
                  .ag-body-viewport {
                    overflow-x: hidden !important;
                  }

                  .ag-header {
                      height: 50px !important;
                      overflow: visible !important;
                      border-bottom: 1px solid #D4D4D4 !important;
                      border-top: 1px solid #D4D4D4 !important;
                      border-right: 1px solid #D4D4D4 !important;
                  }

                  .ag-header :hover .no-sort{
                      visibility: visible;
                  }
                  .down-icon {
                      padding-left: 5px;
                      color: #03a9f4;
                      vertical-align: bottom;
                  }

                  .ag-header-select-all {
                      position: absolute !important;
                      margin: 0px !important;
                      top: 50% !important;
                      left: 50% !important;
                      transform: translate(-50%, -50%) !important;
                      padding: 0px !important;
                  }

                  .single-action {
                      position: absolute !important;
                      margin: 0px !important;
                      top: 55% !important;
                      left: 50% !important;
                      transform: translate(-50%, -50%) !important;
                      padding: 0px !important;
                      cursor: pointer !important;
                  }

                  .sorting-arrows
                      cursor: pointer;
                  }

                  .ag-header-container {
                      background: white !important;
                  }

                  .ag-header-cell {
                      height: 200% !important;
                      margin-top: -15px;
                      padding: 20px 30px 20px 0px;
                  }

                  .sorting-button {
                      display: inline-block;
                  }

                  .no-sort {
                      color: #b0b0b0;
                      visibility: hidden;
                  }

                  .no-sort:hover {
                      color: grey;
                      cursor: pointer;
                  }

                  .no-data-icon {
                      font-size: 100px !important;
                      color: #d3d3d3 !important;
                  }

                  .clear-filters {
                      font-weight: 600;
                      font-size: 14px;
                      color: #03a9f4;
                      cursor: pointer;
                  }

                  .no-rows-text {
                      margin: 15px;
                  }

                  #overlay {
                      pointer-events: auto;
                      margin-top: 50px !important;
                      height: 88% !important;
                  }
                  .ag-overlay-panel {
                      pointer-events: auto !important;
                  }
                  .options-hide i{
                    visibility:hidden;
                  }

                  .customHeaderMenuButton{
                      float: left;
                  }

                  .clear-icon {
                      float: right;
                  }

                  .custom-header {
                      justify-content: center;
                      display: flex;
                      align-items: center;
                      padding: 10px 0px;
                  }

                  .ag-selection-checkbox {
                      position: absolute !important;
                      margin: 0px !important;
                      top: 55% !important;
                      left: 50% !important;
                      transform: translate(-50%, -50%) !important;
                      padding: 0px !important;
                  }

                  .input-filter:focus {
                      outline:none;
                  }

                  .ui-label {
                      color: #666;
                      font-size: 13px;
                      font-weight: 600;
                      position: absolute;
                      pointer-events: none;
                      top: 15px;
                      transition: 0.2s ease all;
                      -moz-transition: 0.2s ease all;
                      -webkit-transition: 0.2s ease all;
                  }
                  .input-filter:focus ~ .ui-label, .input-filter:valid ~ .ui-label {
                      top: 0px;
                      font-size:12px;
                      color:#03a9f4;
                  }

                  .bar {

                  }

                  .bar:before, .bar:after {
                      content:'';
                      height:2px;
                      width:0;
                      bottom:1px;
                      position:absolute;
                      background:#03a9f4;
                      transition:0.2s ease all;
                      -moz-transition:0.2s ease all;
                      -webkit-transition:0.2s ease all;
                  }

                  .bar:before {
                      left:50%;
                  }

                  .bar:after {
                      right:50%;
                  }

                  .input-filter:focus ~ .bar:before, .input-filter:focus ~ .bar:after {
                      width:50%;
                  }

                  .filter-dropdown {
                      display: inline-block;
                      min-width: 140px;
                      position: absolute;
                      background: white;
                      z-index: 100;
                      top: 35px;
                      padding: 5px 0;
                      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);
                      left: 0px;
                  }

                  .filter-dropdown-items {
                      height: 30px;
                      padding-top:5px;
                      list-style: none;
                      font-size: 16px;
                      font-weight: 100;
                  }

                  .ag-cell-not-inline-editing {
                      display: inline-flex;
                      justify-content: center;
                      align-items: center;
                      flex-direction: column;
                      padding-top: 0px !important;
                  }

                  .ag-header-viewport {
                      overflow: visible !important;
                  }

                  #clear-filter {
                      display: none;
                  }
                  .ag-row.ag-row-selected {
                   background-color: #def3fe;
                  }

              </style> `
})

export class UiGridComponent implements OnChanges, AfterViewChecked, AfterViewInit, OnInit, OnDestroy {

    public dataSource;
    public selectedRowCount = 0;
    public isRowSelected = false;
    public loadProgress = 0;
    public isLoaded = true;
    public startRow;
    public endRow;
    public currentPage;
    public totalPages;
    public totalRows;
    public isLastPage;
    public isFirstPage;
    public isGridReady = false;
    public isHeaderMenuVisible = false;
    public clearResize: any;
    public listOfAction: any;
    public listOfSelectedNodes: any;
    public isFirstDisabled = 'all';
    public isLastDisabled = 'all';
    public filterSortResponse;
    public headerActionFirst: any;
    public headerActionSecond: any;
    public remainingheaderAction: Object[] = new Array();
    public isMoreThanTwoHeaderActions = false;
    public selectedRowsPerPage: number;
    public rowsPerPageOptions: Array<number>;
    public showRowsPerPageChangeOption = true;
    public finalGridOptions: GridOptions;

    @Input() gridOptions: GridOptions;

    @Input('gridRowData')
    public gridRowData: any;

    @Input('totalRowData')
    public totalRowData: any;

    @Input('columnDefs')
    public columnDefs: any;

    @Input('pageSize')
    public pageSize: any;

    @Input('paginationStartPage')
    public paginationStartPage: any;

    @Input('isSuppressRowClickSelectionEnabled')
    public isSuppressRowClickSelectionEnabled: any;

    @Input('isSuppressCellSelectionEnabled')
    public isSuppressCellSelectionEnabled: any;

    @Input('gridTitle')
    public gridTitle: any;

    @Input('paginationTitle')
    public paginationTitle: any;

    @Input('filterType')
    public filterType: any;

    @Input('gridHeaderActions')
    public gridHeaderActions: any;

    @Input('gridLocalizedText')
    public gridLocalizedText: any;

    @Input('showHeader')
    public showHeader: any;

    @Input('gridRowHeight')
    public gridRowHeight: any;

    @Input()
    removePreferenceSelection: Subject<any>;

    @Input()
    refreshGridComponent: Subject<any>;

    @Output() public onFilterChangedResponse: EventEmitter<any> = new EventEmitter();

    @Output() public onPaginationChange: EventEmitter<any> = new EventEmitter();

    @Output() public onRowSelectedEvent: EventEmitter<any> = new EventEmitter();

    @Output() public onSelectionChange: EventEmitter<any> = new EventEmitter();

    @Output() public onRowClickedEvent: EventEmitter<any> = new EventEmitter();

    @Output() public onRowsPerPageChange = new EventEmitter();

    removeSelectionSubscription: Subscription;
    refreshGridComponentSubscription: Subscription;

    public localeText =
    {
        SELECT_KEY: 'Select',
        PAGE_KEY: 'Page',
        OF_KEY: 'of',
        DISPLAYED_KEY: 'Displayed',
        NO_ITEMS_FOUND_IN_THE_GRID_KEY: 'NO ITEMS FOUND IN THE GRID',
        CLEAR_FILTERS_KEY: 'CLEAR FILTERS',
        ITEMS_SELECTED_KEY: 'Items Selected',
        ROWS_PER_PAGE: 'Rows per page:'
    };

    public overLayNoRowtemplate = `<div style="z-index:100000 !important">
                                     <i class="material-icons icons no-data-icon" style="font-size:100px;">forum</i>
                                     <div id="no-result">
                                        <div class="no-rows-text">` + this.localeText.NO_ITEMS_FOUND_IN_THE_GRID_KEY + `</div>
                                        <div id="clear-filter" class="clear-filters" onclick="overLayClearFilter(value)">` +
                                        this.localeText.CLEAR_FILTERS_KEY + `</div>
                                     </div>
                                   </div>`;

    constructor(private zone: NgZone) {
        window['angularComponentRef'] = {
            zone: this.zone,
            componentFn: (value) => this.overLayClearFilter(value),
            component: this
        };
    }


    ngAfterViewInit() {
        setTimeout(_ => this.progressChangeValue(100));
    }

    ngOnInit(): void {
        this.preProcess(this.columnDefs);
        this.parseHeaderAction(this.gridHeaderActions);
        this.prepLocalizedText();
        this.finalGridOptions = {
            columnDefs: this.columnDefs,
            enableFilter: true,
            enableSorting: true,
            pagination: true,
            suppressPaginationPanel: true,
            groupSelectsChildren: true,
            rowHeight : this.gridRowHeight,
            groupUseEntireRow: true,
            paginationPageSize: this.pageSize,
            paginationStartPage: this.paginationStartPage,
            suppressMovableColumns: true,
            onFilterChanged: () => { this.onFilterChanged(); },
            onSortChanged: () => { this.onSortChanged(); },
            onRowClicked: (event) => { this.onRowClicked(event); },
            onPaginationChanged: () => { this.onPaginationPageLoaded(); },
            suppressRowClickSelection: this.isSuppressRowClickSelectionEnabled,
            suppressCellSelection: this.isSuppressCellSelectionEnabled,
            onGridReady: () => {
                setTimeout( () => this.finalGridOptions.api.sizeColumnsToFit(), 0 );
                setTimeout(_ => this.progressChangeValue(60));
            },
            overlayNoRowsTemplate: this.overLayNoRowtemplate,
            getRowNodeId: (data) => {
              return data.id;
            }
        };

        this.finalGridOptions = Object.assign(this.finalGridOptions, this.gridOptions);
        this.rowsPerPageOptions = this.finalGridOptions['rowsPerPageOptions'] || [10, 25, 50, 100];
        this.selectedRowsPerPage = this.rowsPerPageOptions[0];
        this.showRowsPerPageChangeOption = this.finalGridOptions['showRowsPerPageChangeOption']
          || this.showRowsPerPageChangeOption;

        this.finalGridOptions.icons = {
            checkboxChecked: '<i class="material-icons icons" style="color: #02a1f3">check_box</i>',
            checkboxUnchecked: '<i class="material-icons icons" style="color:#a3a3a3;">check_box_outline_blank</i>',
            checkboxIndeterminate: '<i class="material-icons icons" style=" color:#a3a3a3;">check_box_outline_blank</i>'
        };

        if (!this.gridTitle) {
            this.gridTitle = 'Items';
        }

        if (!this.paginationTitle) {
            this.paginationTitle = this.gridTitle;
        }

        if (!this.filterType) {
            this.filterType = 'contains';
        }

        if (this.removePreferenceSelection) {
            this.removeSelectionSubscription = this.removePreferenceSelection.subscribe(() => {
                this.finalGridOptions.api.deselectAll();
            });
        }

        if (this.refreshGridComponent) {
            this.refreshGridComponentSubscription = this.refreshGridComponent.subscribe(() => {
                this.refreshRowModel(this.gridRowData);
                this.finalGridOptions.api.refreshInMemoryRowModel();
            });
        }
    }

    ngOnChanges() {
      this.refreshRowModel(this.gridRowData);
    }

    ngAfterViewChecked() {
        if (this.gridRowData && this.gridRowData.length > 0) {
            const clearFilter = document.getElementById('clear-filter');
            if (clearFilter) {
                clearFilter.style.display = 'block';
            }
        }
    }

    ngOnDestroy() {
        if (this.removePreferenceSelection) {
            this.removeSelectionSubscription.unsubscribe();
        }
        if (this.refreshGridComponent) {
            this.refreshGridComponentSubscription.unsubscribe();
        }
    }


 // Function that filters rows by the filter type provided by the user
    setFilter = (colName, filterValue) => {
        const filterOptions = this.finalGridOptions.api.getFilterInstance(colName);

        filterOptions.setModel({
            type: this.filterType,
            filter: filterValue
        });

        this.finalGridOptions.api.onFilterChanged();

        if (this.finalGridOptions.api.getModel().getRowCount() < 1) {
            this.finalGridOptions.api.showNoRowsOverlay();
        } else {
            this.finalGridOptions.api.hideOverlay();
        }
    }

     // Function to get custom actions from user for the header multi select options
    parseHeaderAction(gridHeaderActions: any) {
        if (gridHeaderActions) {
            for (let i = 0; i < gridHeaderActions.length; i++) {
                if (i === 0) {
                    this.headerActionFirst = gridHeaderActions[i];
                } else if (i === 1) {
                    this.headerActionSecond = gridHeaderActions[i];
                } else {
                    this.remainingheaderAction[i - 2] = gridHeaderActions[i];
                    this.isMoreThanTwoHeaderActions = true;
                }
            }
        }
    }

    prepLocalizedText() {
        if (this.gridLocalizedText) {
            for (const key in this.gridLocalizedText) {
                if (this.gridLocalizedText[key]) {
                    this.localeText[key] = this.gridLocalizedText[key];
                }
            }
        }
        this.overLayNoRowtemplate = `<div style="z-index:100000 !important">
                                        <i class="material-icons icons no-data-icon" style="font-size:100px;">forum</i>
                                        <div id="no-result">
                                            <div class="no-rows-text">` + this.localeText.NO_ITEMS_FOUND_IN_THE_GRID_KEY + `</div>
                                            <div id="clear-filter" class="clear-filters" onclick="angularComponentRef.componentFn()">`
                                            + this.localeText.CLEAR_FILTERS_KEY + `</div>
                                        </div>
                                     </div>`;
    }

     // Function to render cell frameworks according to the user definiton of columns
    preProcess(colDefs: string[]) {
        if (colDefs) {
            for (const colDef of colDefs) {
                if (colDef.hasOwnProperty('isCellHoverEnabled') && colDef['isCellHoverEnabled'] === true) {
                    delete colDef['isCellHoverEnabled'];
                    colDef['cellRendererFramework'] = NameCellChangeComponent;
                }
                if (colDef.hasOwnProperty('singleMenuActionItems')) {
                    colDef['cellRendererFramework'] = SingleActionMenuComponent;
                    this.listOfAction = colDef['singleMenuActionItems'];
                }
                if (colDef.hasOwnProperty('isCustomHeaderEnabled') && colDef['isCustomHeaderEnabled'] === true) {
                    colDef['headerComponentFramework'] = <{ new (): CustomHeaderComponent }>CustomHeaderComponent;
                    colDef['headerComponentParams'] = { headerGridOption: this.setFilter };
                }
            }
        }
    }

    refreshRowModel(data) {
      if (data) {
        this.finalGridOptions.api.setRowData(data);
      } else {
        // show no data overlay
      }
      setTimeout(_ => this.progressChangeValue(30));
    }


     // This function is trigerred on selection/deselection of a checkbox
    onSelectionChanged($event) {
        const rowCount = this.finalGridOptions.api.getSelectedNodes().length;
        const renderedNodes = this.finalGridOptions.api.getRenderedNodes();
        const changedRows = [], changedCols = [];
        this.selectedRowCount = rowCount;

        if (this.selectedRowCount > 0) {
            this.isRowSelected = true;
            renderedNodes.forEach(function (renderedNode, index) {
                for (const colm of renderedNode['columnController']['allDisplayedColumns']) {
                    if (colm['colDef'].hasOwnProperty('singleMenuActionItems')) {
                        colm['colDef']['hidden'] = true;
                        changedRows.push(renderedNode);
                        changedCols.push(colm);
                    }
                }
            });
        } else {
            this.isRowSelected = false;
        }

        if (changedRows.length) {
          this.finalGridOptions.api.refreshCells();
        }
        this.listOfSelectedNodes = this.finalGridOptions.api.getSelectedNodes();
        this.onSelectionChange.emit(this.listOfSelectedNodes);
    }

     // This function is trigerred on selection of a row.
    onRowSelected($event) {
        const renderedNodes = this.finalGridOptions.api.getRenderedNodes();
        const changedRows = [], changedCols = [];
        renderedNodes.forEach(function (renderedNode, index) {
            for (const colm of renderedNode['columnController']['allDisplayedColumns']) {
                if (colm['colDef'].hasOwnProperty('singleMenuActionItems')) {
                    colm['colDef']['hidden'] = false;
                    changedRows.push(renderedNode);
                    changedCols.push(colm);
                }
            }
        });
        if (changedRows.length) {
          this.finalGridOptions.api.refreshCells();
        }
        this.onRowSelectedEvent.emit($event);
    }

    // This function deselect all the selected rows and trigger row click event.
    onRowClicked($event) {
      this.finalGridOptions.api.deselectAll();
      this.onRowClickedEvent.emit($event);
    }

    sortData(sortModel, data): any {
        const sortPresent = sortModel && sortModel.length > 0;
        if (!sortPresent) {
            return data;
        }
         // do an in memory sort of the data, across all the fields
        const resultOfSort = data.slice();
        resultOfSort.sort(function (a, b) {
            for (let k = 0; k < sortModel.length; k++) {
                const sortColModel = sortModel[k];
                const valueA = a[sortColModel.colId];
                const valueB = b[sortColModel.colId];
                 // this filter didn't find a difference, move onto the next one
                if (valueA === valueB) {
                    continue;
                }
                const sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
                if (valueA > valueB) {
                    return sortDirection;
                } else {
                    return sortDirection * -1;
                }
            }
             // no filters found a difference
            return 0;
        });
        return resultOfSort;
    };

    sortAndFilter = function (sortModel, filterModel, data) {
        return this.sortData(sortModel, this.filterData(filterModel, data));
    };

    filterData(filterModel, data): any {
        const filterPresent = filterModel && Object.keys(filterModel).length > 0;
        if (!filterPresent) {
            return this.gridRowData;
        }
        let filterType;
        const mapOfFilterOperations = {
            equals: function (input, filterText) { return (input.localeCompare(filterText) === 0); },
            notEquals: function (input, filterText) { return (input.localeCompare(filterText) !== 0); },
            contains: function (input, filterText) {
                        input = input.toLowerCase(); filterText = filterText.toLowerCase();
                        return (input.indexOf(filterText) !== -1);
                      },
            notContains: function (input, filterText) {
                            input = input.toLowerCase(); filterText = filterText.toLowerCase();
                            return (input.indexOf(filterText) === -1);
                        },
            startsWith: function (input, filterText) {
                            input = input.toLowerCase();
                            filterText = filterText.toLowerCase();
                            return (input.indexOf(filterText) === 0);
                        },
            endsWith: function (input, filterText) {
                        input = input.toLowerCase();
                        filterText = filterText.toLowerCase();
                        return (input.substr(-1 * filterText.length, filterText.length) === filterText);
                      }
        };

        const resultOfFilter = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            let flag = true;
            for (const key of Object.keys(filterModel)) {
                const itemVal = (item[key]) ? item[key].toString() : '';
                filterType = filterModel[key]['type'];
                if (!(mapOfFilterOperations[filterType](itemVal, filterModel[key]['filter']))) {
                    flag = false;
                    continue;
                }
            }
            if (flag) {
                resultOfFilter.push(item);
            }
        }
        return resultOfFilter;
    };


     // Function to perform pagination specific tasks
    onPaginationPageLoaded() {
        this.currentPage = this.finalGridOptions.api.paginationGetCurrentPage() + 1;
        this.totalPages = this.finalGridOptions.api.paginationGetTotalPages();
        this.totalRows = this.totalRowData || this.finalGridOptions.api.paginationGetRowCount();
        if ((this.finalGridOptions.api.paginationGetCurrentPage() + 1) === this.finalGridOptions.api.paginationGetTotalPages()) {
            this.isLastPage = '#b5aeae';
            this.isLastDisabled = 'none';
        } else {
            this.isLastPage = '#666';
            this.isLastDisabled = 'all';
        }

        if ((this.finalGridOptions.api.paginationGetCurrentPage() < 1)) {
            this.isFirstPage = '#b5aeae';
            this.isFirstDisabled = 'none';
        } else {
            this.isFirstPage = '#666';
            this.isFirstDisabled = 'all';
        }

        if (this.totalRows === 0) {
            this.totalPages = 1;
            this.startRow = 0;
            this.endRow = 0;
            this.currentPage = 1;
            this.isLastDisabled = 'none';
            this.isFirstDisabled = 'none';
            this.isLastPage = '#b5aeae';
            this.isFirstPage = '#b5aeae';
        }

        if (this.loadProgress > 96) {
            this.isLoaded = false;
        }
    }

     // For navigating to next page in pagination
    onNextClick() {
        this.finalGridOptions.api.paginationGoToNextPage();
        this.finalGridOptions.paginationStartPage++;
        this.onPaginationChange.emit(this.finalGridOptions.api.paginationGetCurrentPage());
    }

     // For navigating to previous page in pagination
    onPreviousClick() {
        this.finalGridOptions.api.paginationGoToPreviousPage();
        this.finalGridOptions.paginationStartPage--;
        this.onPaginationChange.emit(this.finalGridOptions.api.paginationGetCurrentPage());
    }

     // To change the value of progress in progress bar
    progressChangeValue(val) {
        if (val > this.loadProgress) {
            this.loadProgress = val;
        }
    }

    // Function to adjust column size
    @HostListener('window:resize', ['$event', '$event.target'])
    onResize(event) {
        clearTimeout(this.clearResize);
        const that = this;
        this.clearResize = setTimeout(function () {
            that.finalGridOptions.api.sizeColumnsToFit();
        }, 500);
    };

    // Function to invoke the user-defined function
    customEvent(event, action: any, selectedNodes: any): void {
        if (action.hasOwnProperty('custFunc')) {
            action.custFunc(event, selectedNodes);
        }
    }

    filterSortChanged() {
      const currentData = this.sortAndFilter(
        this.finalGridOptions.api.getSortModel(),
        this.finalGridOptions.api.getFilterModel(),
        this.gridRowData
      );
      this.filterSortResponse = {};
      this.filterSortResponse.sort = this.finalGridOptions.api.getSortModel();
      this.filterSortResponse.filter = this.finalGridOptions.api.getFilterModel();
      this.onFilterChangedResponse.emit(this.filterSortResponse);
      this.finalGridOptions.api.deselectAll();
    }

    onFilterChanged() {
        this.filterSortChanged();
    };

    onSortChanged() {
        this.filterSortChanged();
    }

    clearInputFields() {
        const inputFields = document.getElementsByClassName('input-filter');
        for (let i = 0; i < inputFields.length; i++) {
            const inputFieldCast = <HTMLInputElement>inputFields[i];
            if (inputFieldCast.value !== '') {
                inputFieldCast.value = '';
                inputFieldCast.disabled = false;
                inputFieldCast.focus();
                inputFieldCast.blur();
            }
        }
    }

     // To clear filters from no-rows-overlay
    public overLayClearFilter(event) {
        this.finalGridOptions.api.setFilterModel({});
        this.finalGridOptions.api.onFilterChanged();
        this.clearInputFields();
        this.finalGridOptions.api.hideOverlay();
    }


    showActions() {
        this.isHeaderMenuVisible = !this.isHeaderMenuVisible;
    }
    selectedRowsPerPageChange($event) {
        this.onRowsPerPageChange.emit($event.value);
    }
}
