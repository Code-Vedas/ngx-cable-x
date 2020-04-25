import { Component, OnInit, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { UsersApiService } from '../users.api/users.api.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'dm-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss'],
})
export class UserNewComponent implements OnInit {
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Input() user;
  userAddUpdateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usersApiService: UsersApiService
  ) {
    this.user = this.user || {};
    this.userAddUpdateForm = this.formBuilder.group({
      first_name: new FormControl(this.user.first_name, [Validators.required]),
      last_name: new FormControl(this.user.last_name, [Validators.required]),
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
    });
  }
  onSubmit(value) {
    if (this.user.id) {
      this.usersApiService
        .update(this.user.id, value)
        .subscribe((response: any) => {
          if (response && response.error) {
            alert('Error updating user');
          }
          this.onSave.emit('');
        });
    } else {
      this.usersApiService.create(value).subscribe((response: any) => {
        if (response && response.error) {
          alert('Error creating user');
        } else {
          this.userAddUpdateForm.reset();
        }
        this.onSave.emit('');
      });
    }
  }
  ngOnInit() {
    if (this.user.id) {
      this.userAddUpdateForm.setValue({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
      });
    }
  }
}
