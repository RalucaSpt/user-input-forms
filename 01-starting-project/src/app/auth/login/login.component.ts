import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

function mustContainQuestionMark (control: AbstractControl){
  if(control.value.includes('?')){
    return null;
  }
  return {doesNotContainQuestionMark: true};
}

function emailIsUnique(control: AbstractControl){
  if(control.value !== 'test@example.com'){
    return of(null);
  }
  return of({notUnique: true});
}

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('save-login-form');

if(savedForm){
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private dstoryRef = inject(DestroyRef);

  form = new FormGroup({
    email: new FormControl(initialEmailValue,{
      validators: [ Validators.email, Validators.required ],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [ Validators.required, Validators.minLength(6), mustContainQuestionMark],
    }),
  });

  get emailIsInvalid() {
    return this.form.controls.email.invalid && this.form.controls.email.touched && this.form.controls.email.dirty;
  }

  get passwordIsInvalid() {
    return this.form.controls.password.invalid && this.form.controls.password.touched && this.form.controls.password.dirty;
  }

  ngOnInit(): void {
    // const savedForm = window.localStorage.getItem('save-login-form');

    // if(savedForm){
    //   const loadedForm = JSON.parse(savedForm);
    //   this.form.patchValue({
    //     email: loadedForm.email      
    //   });
    // }

      const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
        next: (value) => {
          window.localStorage.setItem('save-login-form', JSON.stringify(value));
        }
      });

      this.dstoryRef.onDestroy(() => {
        subscription.unsubscribe();
      });
  }

  onSubmit() {
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;

  }
}