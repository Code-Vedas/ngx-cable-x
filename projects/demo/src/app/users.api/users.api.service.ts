import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  path = '/api/v1/users';
  usersUrl = '';
  constructor(private httpClient: HttpClient) {
    this.usersUrl = `${environment.apiUrl}${this.path}`;
  }

  list() {
    return this.httpClient.get(this.usersUrl);
  }
  get(id) {
    return this.httpClient.get(`${this.usersUrl}/${id}`);
  }
  create(user) {
    return this.httpClient.post(this.usersUrl, { user: user });
  }
  update(id, user) {
    return this.httpClient.put(`${this.usersUrl}/${id}`, { user: user });
  }
  delete(id) {
    return this.httpClient.delete(`${this.usersUrl}/${id}`);
  }
}
