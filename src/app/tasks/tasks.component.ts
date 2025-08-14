import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { Task, Story, User, TaskStats } from './task.interface';

@Component({
  selector: 'app-tasks',
  styleUrl: './tasks.component.scss',
  template: `
    <div class="tasks-container">
      <div class="header">
        <div class="header-left">
          <h1><i class="fas fa-tasks"></i>Task Management</h1>
          <p class="user-info">Manage your project tasks and track progress</p>
        </div>
        <div class="header-actions">
          <button 
            class="btn btn-primary"
            (click)="showAddForm.set(!showAddForm())"
            [disabled]="taskService.loading()">
            <i class="fas fa-plus"></i>
            Add New Task
          </button>
        </div>
      </div>

      <!-- Task Statistics Cards -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="stat-content">
              <h3>{{ taskStats().total }}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon new">
              <i class="fas fa-plus-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ taskStats().new }}</h3>
              <p>New</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon progress">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-content">
              <h3>{{ taskStats().inProgress }}</h3>
              <p>In Progress</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon completed">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ taskStats().completed }}</h3>
              <p>Completed</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon estimation">
              <i class="fas fa-hourglass-half"></i>
            </div>
            <div class="stat-content">
              <h3>{{ taskStats().totalEstimationHours }}h</h3>
              <p>Estimated</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon working">
              <i class="fas fa-play-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ taskStats().totalWorkingHours }}h</h3>
              <p>Worked</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      @if (taskService.error()) {
        <div class="alert">
          <i class="fas fa-exclamation-triangle"></i>
          {{ taskService.error() }}
          <button class="btn-close" (click)="taskService.clearError()">×</button>
        </div>
      }

      <!-- Add/Edit Task Form Modal -->
      @if (showAddForm() || editingTask()) {
        <div class="form-overlay">
          <div class="form-modal">
            <div class="form-header">
              <h2>
                <i class="fas fa-{{ editingTask() ? 'edit' : 'plus' }}"></i>
                {{ editingTask() ? 'Edit Task' : 'Add New Task' }}
              </h2>
              <button class="btn-close" (click)="cancelForm()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <form [formGroup]="taskForm" (ngSubmit)="submitForm()" class="task-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="title">Title <span class="required">*</span></label>
                  <input
                    id="title"
                    type="text"
                    formControlName="title"
                    class="form-control"
                    [class.error]="taskForm.get('title')?.errors && taskForm.get('title')?.touched"
                    placeholder="Enter task title">
                  @if (taskForm.get('title')?.errors?.['required'] && taskForm.get('title')?.touched) {
                    <span class="error-text">Title is required</span>
                  }
                  @if (taskForm.get('title')?.errors?.['minlength'] && taskForm.get('title')?.touched) {
                    <span class="error-text">Title must be at least 3 characters</span>
                  }
                </div>
                
                <div class="form-group">
                  <label for="status">Status <span class="required">*</span></label>
                  <select id="status" formControlName="status" class="form-control">
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="description">Description</label>
                <textarea
                  id="description"
                  formControlName="description"
                  class="form-control"
                  rows="4"
                  placeholder="Enter task description..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="estimationHours">Estimation Hours <span class="required">*</span></label>
                  <input
                    id="estimationHours"
                    type="number"
                    min="0"
                    step="0.5"
                    formControlName="estimationHours"
                    class="form-control"
                    [class.error]="taskForm.get('estimationHours')?.errors && taskForm.get('estimationHours')?.touched"
                    placeholder="0">
                  @if (taskForm.get('estimationHours')?.errors?.['required'] && taskForm.get('estimationHours')?.touched) {
                    <span class="error-text">Estimation hours is required</span>
                  }
                </div>
                
                <div class="form-group">
                  <label for="workingHours">Working Hours</label>
                  <input
                    id="workingHours"
                    type="number"
                    min="0"
                    step="0.5"
                    formControlName="workingHours"
                    class="form-control"
                    placeholder="0">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="storyId">Story <span class="required">*</span></label>
                  <select 
                    id="storyId" 
                    formControlName="storyId" 
                    class="form-control"
                    [class.error]="taskForm.get('storyId')?.errors && taskForm.get('storyId')?.touched">
                    <option value="">Select a story</option>
                    @for (story of taskService.stories(); track story.id) {
                      <option [value]="story.id">
                        {{ story.title }} ({{ story.StoryPoint }} points)
                      </option>
                    }
                  </select>
                  @if (taskForm.get('storyId')?.errors?.['required'] && taskForm.get('storyId')?.touched) {
                    <span class="error-text">Story selection is required</span>
                  }
                </div>
                
                <div class="form-group">
                  <label for="assignedTo">Assigned To <span class="required">*</span></label>
                  <select 
                    id="assignedTo" 
                    formControlName="assignedTo" 
                    class="form-control"
                    [class.error]="taskForm.get('assignedTo')?.errors && taskForm.get('assignedTo')?.touched">
                    <option value="">Select a user</option>
                    @for (user of taskService.users(); track user.id) {
                      <option [value]="user.id">{{ user.name }} ({{ user.email }})</option>
                    }
                  </select>
                  @if (taskForm.get('assignedTo')?.errors?.['required'] && taskForm.get('assignedTo')?.touched) {
                    <span class="error-text">User assignment is required</span>
                  }
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="taskForm.invalid || taskService.loading()">
                  @if (taskService.loading()) {
                    <i class="fas fa-spinner loading"></i>
                  } @else {
                    <i class="fas fa-{{ editingTask() ? 'save' : 'plus' }}"></i>
                  }
                  {{ editingTask() ? 'Update Task' : 'Create Task' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Filters and Search -->
      <div class="filters-container">
        <div class="search-group">
          <div class="search-input">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search tasks..."
              [value]="searchTerm()"
              (input)="updateSearchTerm($event)"
              class="form-control">
          </div>
        </div>
        
        <div class="filter-group">
          <select [value]="selectedStatus()" (change)="updateStatusFilter($event)" class="form-control">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Testing">Testing</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
        
        <div class="filter-group">
          <select [value]="selectedStory()" (change)="updateStoryFilter($event)" class="form-control">
            <option value="">All Stories</option>
            @for (story of taskService.stories(); track story.id) {
              <option [value]="story.id">{{ story.title }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Tasks Table -->
      <div class="table-container">
        @if (taskService.loading()) {
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        } @else if (filteredTasks().length === 0) {
          <div class="empty-state">
            <i class="fas fa-clipboard-list fa-3x"></i>
            <h3>No Tasks Found</h3>
            <p>
              @if (searchTerm() || selectedStatus() || selectedStory()) {
                Try adjusting your search criteria or filters.
              } @else {
                Create your first task to get started.
              }
            </p>
          </div>
        } @else {
          <table class="tasks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Story</th>
                <th>Assigned To</th>
                <th>Hours</th>
                <th>Progress</th>
                <th class="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (task of filteredTasks(); track task.id) {
                <tr>
                  <td class="task-title">
                    <div class="task-info">
                      <h4>{{ task.title }}</h4>
                      @if (task.description) {
                        <p class="task-description">{{ task.description }}</p>
                      }
                    </div>
                  </td>
                  
                  <td>
                    <span class="status-badge" [class]="'status-' + task.status.toLowerCase().replace(' ', '-')">
                      {{ task.status }}
                    </span>
                  </td>
                  
                  <td class="story-info">
                    @if (task.story) {
                      <div>
                        <strong>{{ task.story.title }}</strong>
                        <small>({{ task.story.StoryPoint }} pts)</small>
                      </div>
                    } @else {
                      <span class="text-muted">Story #{{ task.storyId }}</span>
                    }
                  </td>
                  
                  <td class="user-info">
                    @if (task.assignedUser) {
                      <div>
                        <strong>{{ task.assignedUser.name }}</strong>
                        <small>{{ task.assignedUser.email }}</small>
                      </div>
                    } @else {
                      <span class="text-muted">User #{{ task.assignedTo }}</span>
                    }
                  </td>
                  
                  <td class="hours-info">
                    <div class="hours-display">
                      <div class="time-item">
                        <i class="fas fa-clock"></i>
                        <span>{{ task.workingHours || 0 }}h / {{ task.estimationHours }}h</span>
                      </div>
                    </div>
                  </td>
                  
                  <td class="progress-info">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        [style.width.%]="getProgressPercentage(task)">
                      </div>
                    </div>
                    <small>{{ getProgressPercentage(task) }}%</small>
                  </td>
                  
                  <td class="actions-column">
                    <div class="action-buttons">
                      <button
                        class="btn btn-sm btn-outline"
                        (click)="editTask(task)"
                        [disabled]="taskService.loading()">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-danger"
                        (click)="deleteTask(task)"
                        [disabled]="taskService.loading()">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {
  protected readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);

  // Component state signals
  showAddForm = signal(false);
  editingTask = signal<Task | null>(null);
  searchTerm = signal('');
  selectedStatus = signal('');
  selectedStory = signal('');

  // Reactive form for task creation/editing
  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    estimationHours: [0, [Validators.required, Validators.min(0)]],
    workingHours: [0, [Validators.min(0)]],
    status: ['New', Validators.required],
    storyId: ['', Validators.required],
    assignedTo: ['', Validators.required]
  });

  // Computed properties
  taskStats = computed(() => this.taskService.getTaskStats());
  
  filteredTasks = computed(() => {
    let tasks = this.taskService.tasks();
    
    // Apply search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(search) ||
        (task.description && task.description.toLowerCase().includes(search))
      );
    }
    
    // Apply status filter
    if (this.selectedStatus()) {
      tasks = tasks.filter(task => task.status === this.selectedStatus());
    }
    
    // Apply story filter
    if (this.selectedStory()) {
      tasks = tasks.filter(task => task.storyId === Number(this.selectedStory()));
    }
    
    return tasks;
  });

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      // Load all required data in parallel
      await Promise.all([
        this.taskService.getAllTasks().toPromise(),
        this.taskService.getAllStories().toPromise(),
        this.taskService.getAllUsers().toPromise()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  submitForm(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData = {
        ...formValue,
        storyId: Number(formValue.storyId),
        assignedTo: Number(formValue.assignedTo),
        estimationHours: Number(formValue.estimationHours),
        workingHours: Number(formValue.workingHours) || 0
      };

      const editingTaskData = this.editingTask();
      if (editingTaskData && editingTaskData.id) {
        this.updateTask(editingTaskData.id, taskData);
      } else {
        this.createTask(taskData);
      }
    }
  }

  createTask(taskData: Omit<Task, 'id'>): void {
    this.taskService.createTask(taskData).subscribe({
      next: (response) => {
        if (response.success) {
          this.resetForm();
          console.log('Task created successfully');
        }
      },
      error: (error) => {
        console.error('Error creating task:', error);
      }
    });
  }

  updateTask(id: number, taskData: Partial<Task>): void {
    this.taskService.updateTask(id, taskData).subscribe({
      next: (response) => {
        if (response.success) {
          this.resetForm();
          console.log('Task updated successfully');
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask.set(task);
    this.showAddForm.set(true);
    
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      estimationHours: task.estimationHours,
      workingHours: task.workingHours || 0,
      status: task.status,
      storyId: task.storyId,
      assignedTo: task.assignedTo
    });
  }

  deleteTask(task: Task): void {
    if (task.id && confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Task deleted successfully');
          }
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  cancelForm(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.showAddForm.set(false);
    this.editingTask.set(null);
    this.taskForm.reset({
      status: 'New',
      estimationHours: 0,
      workingHours: 0
    });
  }

  updateSearchTerm(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  updateStatusFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
  }

  updateStoryFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStory.set(target.value);
  }

  applyFilters(): void {
    // Triggers computed signal recalculation
    // The filteredTasks computed signal will automatically update
  }

  getProgressPercentage(task: Task): number {
    if (!task.estimationHours || task.estimationHours === 0) {
      return task.status === 'Completed' ? 100 : 0;
    }
    const percentage = Math.min((task.workingHours || 0) / task.estimationHours * 100, 100);
    return Math.round(percentage);
  }
}
