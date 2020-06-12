import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-style-view',
  templateUrl: './style-view.component.html',
  styleUrls: ['./style-view.component.less']
})
export class StyleViewComponent implements OnInit {

  @Input() data: object;

  constructor() { }

  ngOnInit(): void {
  }

}
