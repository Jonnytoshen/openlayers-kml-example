import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Vector as VectorLayer } from 'ol/layer';

@Component({
  selector: 'app-layers-view',
  templateUrl: './layers-view.component.html',
  styleUrls: ['./layers-view.component.less']
})
export class LayersViewComponent implements OnInit {

  @Input() layers: Array<VectorLayer> = [];

  @Output() onClickSnippet = new EventEmitter<VectorLayer>();
  @Output() onClickExport = new EventEmitter<VectorLayer>();
  @Output() onClickDelete = new EventEmitter<VectorLayer>();

  constructor() { }

  ngOnInit(): void {
  }

}
