import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    firstname: null,
    lastname: null,
    profileImg: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.form.profileImg = file;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('username', this.form.username);
    formData.append('firstname', this.form.firstname);
    formData.append('lastname', this.form.lastname);
    formData.append('email', this.form.email);
    formData.append('password', this.form.password);
    formData.append('profileImg', this.form.profileImg);

    this.authService.register(formData).subscribe(
      (response) => {
        // Handle successful registration
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      (err) => {
        // Handle registration error
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  // onSubmit(): void {
  //   const { username, email, password,firstname, lastname, profileImg } = this.form;

  //   this.authService.register(username,firstname, lastname, email, password, profileImg).subscribe({
  //     next: data => {
  //       console.log(data);
  //       this.isSuccessful = true;
  //       this.isSignUpFailed = false;
  //     },
  //     error: err => {
  //       this.errorMessage = err.error.message;
  //       this.isSignUpFailed = true;
  //     }
  //   });
  // }
}
