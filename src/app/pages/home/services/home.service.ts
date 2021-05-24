import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from 'type/user';

interface Menu {
  id: number;
  title: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  menu: Array<Menu> = [
    {
      id: 1,
      title: '热门',
      link: 'hot'
    },
    {
      id: 2,
      title: '男装',
      link: 'man'
    },
    {
      id: 3,
      title: '女装',
      link: 'women'
    },
  ];
  constructor(private http: HttpClient) { }

  // getUser(): Observable<any> {
  //   return this.http.get(`${environment.baseUrl}/users`, {
  //     params: { id: '10' }
  //   });
  // }
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseUrl}/users`);
  }

  setMenu(): void {
    this.menu.push({
      id: 4,
      title: '童装',
      link: 'child'
    });
  }
}
