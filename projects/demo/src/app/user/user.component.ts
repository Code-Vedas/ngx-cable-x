import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../users.api/users.api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dm-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: any;
  constructor(
    private usersApiService: UsersApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.getUser();
  }
  getUser() {
    this.usersApiService
      .get(this.activatedRoute.snapshot.params.user_id)
      .subscribe((response: any) => {
        if (response && response.error) {
          this.router.navigateByUrl('/');
        } else {
          this.user = response.user;
        }
      });
  }
}
