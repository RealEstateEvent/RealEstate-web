import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/internal/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  constructor(private _auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) {
      if(this._auth.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*$")]],
      password: ['', [Validators.required]],
     });
  }

  onSubmit() {
    if(this.form.valid) {
      this._auth.logIn(this.form.value).then((value) => {
        console.log("value",value);
      }, (err) => {
        console.log("err",err);
        if(err === 2) {
          alert('For now there is only support for organizer and speaker. Please use our android and ios app if you are attendee.')
        }
      });
    } else {
      alert('inputs are not valid');
    }
  }
}
