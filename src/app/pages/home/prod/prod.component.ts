import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';

interface Menu {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-prod',
  templateUrl: './prod.component.html',
  styleUrls: ['./prod.component.scss']
})
export class ProdComponent implements OnInit {
  selectedLink = '';
  constructor(private route: ActivatedRoute, private service: HomeService) { }
  menu: Array<Menu> = [];
  ngOnInit(): void {
    this.menu = this.service.menu;
    this.route.params.subscribe(params => {
      this.selectedLink = params.link;
    });
  }
}
