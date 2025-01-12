import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  onSubmit(formData: NgForm) {
    if(formData.form.valid){
      return;
    }

    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}
