import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  isEdit: Boolean = false;
  form: any = {
    username: null,
    email: null,
    firstname: null,
    lastname: null,
    profileImg: null,
  };

  constructor(private storageService: StorageService, private authService: AuthService) { }

  

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.form = this.currentUser;
  }

  showEdit() {
    this.isEdit = true;
  }

  toggleEdit(): void {
    this.isEdit = !this.isEdit;
  }

  onSubmit(): void {
    const { username, email,firstname, lastname, id } = this.form;

    this.authService.update(username,firstname, lastname, email, id).subscribe({
      next: data => {
        console.log(data, "data")
        this.storageService.saveUser(data);
        console.log(data);
      },
      error: err => {
      }
    });
  }

}
