import { Component, ElementRef, Inject, AfterViewChecked, HostListener} from '@angular/core';
// import {ICellRendererAngularComp} from 'ag-grid-angular';

/*
    This component has functionality to render single action menu dropdown framework and the actions performed by them.
*/

@Component({
    selector: 'app-single-action-menu',

    template: `<i class="material-icons ui-icons single-action" (click)="showRowMenu($event)" *ngIf="!actions.colDef.hidden">more_vert </i>
               <div *ngIf="isSingleActionVisible" class="dropdown-content">
                    <div *ngFor="let action of actions.colDef.singleMenuActionItems" (click)="customEvent($event, action)" class="actions">
                        <span [innerHtml]= "action.icon" class="single-action-icon"></span>
                        <span>{{action.actionName}} </span>
                    </div>
               </div>`
})

export class SingleActionMenuComponent implements AfterViewChecked {
    public actions: any;
    public isSingleActionVisible = false;

    constructor(private _elementRef: ElementRef) { }

    ngAfterViewChecked() {
        if (this._elementRef.nativeElement.offsetParent) {
            this._elementRef.nativeElement.offsetParent.style.overflow = 'visible';
        }
    }

    agInit(params: any): void {
       this.actions = params;
    }
    refresh(params: any): void {
      this.actions = params;
    }

    customEvent(event, action: any): void {
        if (action.hasOwnProperty('custFunc')) {
           action.custFunc(event, this.actions);
        }
    }

    showRowMenu (event) {
        event.stopPropagation();
        this.isSingleActionVisible = ! this.isSingleActionVisible;
    }

    @HostListener('document:click', ['$event', '$event.target'])
    onWindowClick(event) {
        if (!this._elementRef.nativeElement.contains(event.target)) {
            this.isSingleActionVisible = false;
        }
    }

}
