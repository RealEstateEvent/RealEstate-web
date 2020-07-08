import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/internal/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  constructor(private _auth: AuthService,
    private formBuilder: FormBuilder,) {
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
      });
    } else {
      alert('inputs are not valid');
    }
  }
}
