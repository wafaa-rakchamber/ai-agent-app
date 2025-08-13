import { Component, input, output, effect, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from './user.service';

@Component({
  selector: 'app-user-form',
  template: `
    <div class="user-form">
      <h3>{{ isEdit() ? 'Edit User' : 'Add New User' }}</h3>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name:</label>
          <input 
            id="name" 
            type="text" 
            formControlName="name" 
            [class.error]="nameControl.invalid && nameControl.touched"
          >
          @if (nameControl.invalid && nameControl.touched) {
            <span class="error-message">Name is required</span>
          }
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email"
            [class.error]="emailControl.invalid && emailControl.touched"
          >
          @if (emailControl.invalid && emailControl.touched) {
            <span class="error-message">
              @if (emailControl.errors?.['required']) {
                Email is required
              } @else if (emailControl.errors?.['email']) {
                Please enter a valid email
              }
            </span>
          }
        </div>

        @if (!isEdit()) {
          <div class="form-group">
            <label for="password">Password:</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              [class.error]="passwordControl.invalid && passwordControl.touched"
            >
            @if (passwordControl.invalid && passwordControl.touched) {
              <span class="error-message">Password is required</span>
            }
          </div>
        }

        <div class="form-actions">
          <button type="submit" [disabled]="userForm.invalid || loading()">
            {{ loading() ? 'Saving...' : (isEdit() ? 'Update User' : 'Create User') }}
          </button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .user-form {
      background: white;
      padding: 32px;
      border-radius: 20px;
      margin-bottom: 30px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 1px solid #e5e7eb;
      position: relative;
      overflow: hidden;
    }

    .user-form::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
    }

    .user-form h3 {
      margin: 0 0 24px 0;
      color: #1e293b;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: #fafafa;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    input.error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .error-message {
      color: #ef4444;
      font-size: 13px;
      margin-top: 6px;
      display: block;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      justify-content: center;
    }

    button {
      padding: 14px 32px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    button[type="submit"] {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    }

    button[type="submit"]:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }

    button[type="submit"]:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    button[type="button"] {
      background: linear-gradient(135deg, #6b7280, #4b5563);
      color: white;
      box-shadow: 0 4px 16px rgba(107, 114, 128, 0.3);
    }

    button[type="button"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(107, 114, 128, 0.4);
    }

    button:active {
      transform: translateY(0);
    }

    @media (max-width: 640px) {
      .user-form {
        padding: 24px;
        margin: 0 10px 20px 10px;
      }

      .form-actions {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);

  user = input<User | null>(null);
  loading = input<boolean>(false);
  
  save = output<User>();
  cancel = output<void>();

  userForm: FormGroup;

  isEdit = computed(() => !!this.user()?.id);

  constructor() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.userForm.patchValue({
          name: currentUser.name,
          email: currentUser.email
        });
        // Remove password requirement for edit
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      } else {
        this.userForm.reset();
        // Add password requirement for new user
        this.userForm.get('password')?.setValidators([Validators.required]);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  get nameControl() { return this.userForm.get('name')!; }
  get emailControl() { return this.userForm.get('email')!; }
  get passwordControl() { return this.userForm.get('password')!; }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: User = {
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password && { password: formValue.password })
      };
      
      if (this.user()?.id) {
        userData.id = this.user()!.id;
      }
      
      this.save.emit(userData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
