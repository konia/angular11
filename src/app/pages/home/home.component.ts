import { HomeService } from './services/home.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from 'type/user';
interface Menu {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  menu: Array<Menu> = [];
  user: Array<User> = [];
  constructor(private router: Router, private service: HomeService) { }

  loadimg = '../../../assets/img.jpeg';

  date = '2021/05/04 12:50:00';
  ngOnInit(): void {
    this.menu = this.service.menu;
  }

  handleLink(i: Menu): void {
    this.router.navigate(['home', i.link]);
  }

  getUser(): void {
    console.log(this.service.getUser());
    this.service.getUser().subscribe((res: User[]) =>
      this.user = res
    );
  }
}
