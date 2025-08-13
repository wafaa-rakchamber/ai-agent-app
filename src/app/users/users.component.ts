import { Component, signal, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from './user.service';
import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule, UserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);

  users = signal<User[]>([]);
  loading = signal(false);
  error = signal('');
  showForm = signal(false);
  editingUser = signal<User | null>(null);
  formLoading = signal(false);
  currentUserId = signal<number>(2); // Based on JWT token, user ID is 2

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set('');
    
    console.log('Loading users...');
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Users loaded successfully:', users);
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error.set(typeof err === 'string' ? err : 'Failed to load users - Please check console for details');
        this.loading.set(false);
      }
    });
  }

  showAddForm() {
    this.editingUser.set(null);
    this.showForm.set(true);
  }

  showEditForm(user: User) {
    if (user.id !== this.currentUserId()) {
      this.error.set('You can only edit your own profile');
      return;
    }
    this.editingUser.set(user);
    this.showForm.set(true);
  }

  hideForm() {
    this.showForm.set(false);
    this.editingUser.set(null);
  }

  saveUser(userData: User) {
    this.formLoading.set(true);
    this.error.set('');

    const isEdit = !!userData.id;
    
    if (isEdit && userData.id !== this.currentUserId()) {
      this.formLoading.set(false);
      this.error.set('You can only update your own profile');
      return;
    }
    
    console.log(`${isEdit ? 'Updating' : 'Creating'} user:`, userData);
    
    const operation = isEdit 
      ? this.userService.updateUser(userData.id!, userData)
      : this.userService.createUser(userData);

    operation.subscribe({
      next: (response) => {
        console.log(`User ${isEdit ? 'updated' : 'created'} successfully:`, response);
        this.formLoading.set(false);
        this.hideForm();
        this.loadUsers(); // Refresh the list
      },
      error: (err) => {
        this.formLoading.set(false);
        const errorMessage = typeof err === 'string' ? err : `Failed to ${isEdit ? 'update' : 'create'} user - Please check console for details`;
        this.error.set(errorMessage);
        console.error(`Error ${isEdit ? 'updating' : 'creating'} user:`, err);
      }
    });
  }

  deleteUser(user: User) {
    if (!user.id) return;
    
    if (user.id !== this.currentUserId()) {
      this.error.set('You can only delete your own account');
      return;
    }
    
    if (confirm(`Are you sure you want to delete your account "${user.name}"? This action cannot be undone.`)) {
      this.loading.set(true);
      this.error.set('');

      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loading.set(false);
          this.loadUsers(); // Refresh the list
        },
        error: (err) => {
          this.loading.set(false);
          const errorMessage = typeof err === 'string' ? err : 'Failed to delete user - Please check console for details';
          this.error.set(errorMessage);
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  showEditNotAllowed() {
    this.error.set('You can only edit your own profile');
  }

  deleteNotAllowed() {
    this.error.set('You can only delete your own account');
  }
}
