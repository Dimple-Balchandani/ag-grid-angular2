import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid';
import {Component} from '@angular/core';

@Component({
  selector: 'ai-toggle-cell',
  template: `<md-slide-toggle [disabled]="params.colDef.disable && params.colDef.disable()"
[(ngModel)]="params.data[params.colDef.field]" (click)="onClick($event)"></md-slide-toggle>`,
  styles: [`
      md-slide-toggle {
      margin: 0;
      }
  `]
})
export class ToggleRendererComponent {
  params: ICellRendererParams;
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams): void {
    this.params = params;
  }

  onClick($event): void {
    $event.stopPropagation();
    if (this.params.colDef.hasOwnProperty('onClick') && this.params.colDef['onClick']) {
      window.setTimeout(
        () => this.params.colDef['onClick'](this.params.data, this.params.data[this.params.colDef.field])
      );
    }
  }

}
