import { Component} from '@angular/core';

/*
    This component provides feature like changing the text color on hover
*/

@Component({
    selector: 'app-name-cell-change',
    template: `<span class="name-change-color" (click)="onCellCustomClick($event, params)">{{params.value}}</span>
              <style>
                  .name-change-color{
                      max-width: 260px;
                      display: inline-block;
                      cursor: pointer;
                      color: #03A9F4;
                  }

                  .name-change-color:hover{
                      color:#01579B !important;
                      cursor: pointer;
                  }
              </style>`,
})

export class NameCellChangeComponent  {
    public params: any;
    constructor() { }

    agInit(params: any): void {
        this.params = params;
    }

    onCellCustomClick(event, params: any) {
        if (this.params.colDef.hasOwnProperty('customCellFunction')) {
            this.params.colDef.customCellFunction(event, params);
        }
    }
}
