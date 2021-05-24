import { Component, OnInit } from '@angular/core';

interface Menu {
  title: string;
  link: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  selected = 0;

  tabs: Array<Menu> = [
    { title: '热门', link: '#' },
    { title: '男装', link: '#' },
    { title: '手机', link: '#' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
