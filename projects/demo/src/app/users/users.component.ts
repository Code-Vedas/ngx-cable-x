import { UsersApiService } from './../users.api/users.api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dm-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users = [];
  constructor(private usersApiService: UsersApiService) {}

  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    this.usersApiService.list().subscribe((response: any) => {
      if (response && response.error) {
        this.users = [];
      } else {
        this.users = response.users;
      }
    });
  }
  deleteUser(user) {
    const isDeleteUser = confirm('You sure?');
    if (isDeleteUser) {
      this.usersApiService.delete(user.id).subscribe((response: any) => {
        if (response && response.error) {
          alert('Error Deleting User');
        }
        this.getUsers();
      });
    }
  }
}
