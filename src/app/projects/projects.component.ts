import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from './project.service';
import { Project } from './project.interface';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // Signals for state management
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isEditing = signal(false);
  readonly editingProjectId = signal<number | null>(null);
  readonly showForm = signal(false);

  // Form
  projectForm: FormGroup;

  // Computed properties
  readonly hasProjects = computed(() => this.projects().length > 0);
  readonly formTitle = computed(() => 
    this.isEditing() ? 'Edit Project' : 'Add New Project'
  );
  readonly currentUser = computed(() => this.authService.getCurrentUser());

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      startDate: ['', Validators.required],
      deadLine: ['', Validators.required],
      status: ['New', Validators.required]
    });
  }

  ngOnInit() {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.error.set('Please log in to access projects.');
      this.router.navigate(['/login']);
      return;
    }
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    this.error.set(null);

    this.projectService.getProjects().subscribe({
      next: (response) => {
        // Handle both direct array response and wrapped API response
        const projects = Array.isArray(response) ? response : response.data || [];
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        if (err.status === 401 || err.status === 403) {
          this.error.set('Authentication expired. Please log in again.');
          this.authService.logout();
        } else {
          this.error.set('Failed to load projects. Please try again.');
        }
        this.loading.set(false);
      }
    });
  }

  showAddForm() {
    this.isEditing.set(false);
    this.editingProjectId.set(null);
    this.projectForm.reset({ status: 'New' });
    this.showForm.set(true);
  }

  editProject(project: Project) {
    this.isEditing.set(true);
    this.editingProjectId.set(project.id!);
    this.projectForm.patchValue({
      name: project.name,
      description: project.description || '',
      startDate: project.startDate,
      deadLine: project.deadLine,
      status: project.status || 'New'
    });
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.isEditing.set(false);
    this.editingProjectId.set(null);
    this.projectForm.reset();
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      return;
    }

    const formValue = this.projectForm.value;
    this.loading.set(true);

    if (this.isEditing()) {
      // Update existing project
      const projectId = this.editingProjectId();
      if (projectId) {
        this.projectService.updateProject(projectId, formValue).subscribe({
          next: () => {
            this.loadProjects();
            this.cancelForm();
          },
          error: (err) => {
            console.error('Error updating project:', err);
            if (err.status === 401 || err.status === 403) {
              this.error.set('Authentication expired. Please log in again.');
              this.authService.logout();
            } else {
              this.error.set('Failed to update project. Please try again.');
            }
            this.loading.set(false);
          }
        });
      }
    } else {
      // Create new project
      this.projectService.createProject(formValue).subscribe({
        next: () => {
          this.loadProjects();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error creating project:', err);
          if (err.status === 401 || err.status === 403) {
            this.error.set('Authentication expired. Please log in again.');
            this.authService.logout();
          } else {
            this.error.set('Failed to create project. Please try again.');
          }
          this.loading.set(false);
        }
      });
    }
  }

  deleteProject(project: Project) {
    if (!project.id) return;
    
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      this.loading.set(true);
      
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          if (err.status === 401 || err.status === 403) {
            this.error.set('Authentication expired. Please log in again.');
            this.authService.logout();
          } else {
            this.error.set('Failed to delete project. Please try again.');
          }
          this.loading.set(false);
        }
      });
    }
  }

  refreshProjects() {
    this.loadProjects();
  }

  // Helper methods for template
  getFieldError(fieldName: string): string | null {
    const field = this.projectForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }

  // Description formatting helpers
  getDescriptionClass(description: string | undefined): string {
    if (!description || description.trim().length === 0) {
      return 'empty-description';
    }
    if (description.length > 50) {
      return 'long-description';
    }
    return '';
  }

  formatDescription(description: string | undefined): string {
    if (!description || description.trim().length === 0) {
      return 'No description provided';
    }
    return description;
  }
}
