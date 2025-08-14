import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoryService } from '../services/story.service';
import { Story, StoryFormData } from '../models/story.interface';
import { Project } from '../services/api-test.service';

@Component({
  selector: 'app-story',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  private readonly storyService = inject(StoryService);
  private readonly fb = inject(FormBuilder);

  // Signals
  stories = signal<Story[]>([]);
  projects = signal<Project[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  showForm = signal(false);
  editingStory = signal<Story | null>(null);
  selectedProjectFilter = signal<number | null>(null);
  selectedStatusFilter = signal<string>('');

  // Form
  storyForm: FormGroup;

  // Constants
  statusOptions: Array<'New' | 'inProgress' | 'Closed' | 'Canceled'> = 
    ['New', 'inProgress', 'Closed', 'Canceled'];

  // Computed
  filteredStories = computed(() => {
    let filtered = this.stories();
    const projectFilter = this.selectedProjectFilter();
    const statusFilter = this.selectedStatusFilter();
    
    console.log('Computing filtered stories - Project filter:', projectFilter, 'Status filter:', statusFilter);
    
    if (projectFilter !== null) {
      console.log('Filtering by project ID:', projectFilter);
      filtered = filtered.filter(story => {
        console.log(`Story ${story.id}: projectId=${story.projectId} (type: ${typeof story.projectId}), comparing with ${projectFilter} (type: ${typeof projectFilter})`);
        return story.projectId === projectFilter;
      });
      console.log('Stories after project filter:', filtered);
    }
    
    if (statusFilter && statusFilter.trim() !== '') {
      console.log('Filtering by status:', statusFilter);
      filtered = filtered.filter(story => story.status === statusFilter);
    
    
    
    if (projectFilter !== null) {
      
      filtered = filtered.filter(story => {
        
        return story.projectId === projectFilter;
      });
      
    }
    
    if (statusFilter && statusFilter.trim() !== '') {
      
      filtered = filtered.filter(story => story.status === statusFilter);
      
    }
    
    return filtered;
  });

  constructor() {
    this.storyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      iteration: [''],
      status: ['New', Validators.required],
      StoryPoint: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      projectId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadStories();
  }

  private loadProjects(): void {
    this.storyService.getProjects().subscribe({
      next: (projects) => {
        console.log('Projects loaded:', projects);
        this.projects.set(projects);
      },
      error: (error) => {
        this.error.set('Failed to load projects');
        console.error('Error loading projects:', error);
      }
    });
  }

  private loadStories(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.storyService.getStories().subscribe({
      next: (stories) => {
        this.stories.set(stories);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load stories');
        this.isLoading.set(false);
        console.error('Error loading stories:', error);
      }
    });
  }

  showAddForm(): void {
    this.editingStory.set(null);
    this.storyForm.reset({
      status: 'New',
      StoryPoint: 1
    });
    this.showForm.set(true);
    this.clearMessages();
  }

  editStory(story: Story): void {
    this.editingStory.set(story);
    this.storyForm.patchValue({
      title: story.title,
      description: story.description,
      iteration: story.iteration,
      status: story.status,
      StoryPoint: story.StoryPoint,
      projectId: story.projectId
    });
    this.showForm.set(true);
    this.clearMessages();
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingStory.set(null);
    this.storyForm.reset();
    this.clearMessages();
  }

  onSubmit(): void {
    if (this.storyForm.valid) {
      this.isLoading.set(true);
      this.clearMessages();
      
      const formData: StoryFormData = this.storyForm.value;
      
      const operation = this.editingStory() 
        ? this.storyService.updateStory(this.editingStory()!.id!, formData)
        : this.storyService.createStory(formData);

      operation.subscribe({
        next: (story) => {
          const currentStories = this.stories();
          if (this.editingStory()) {
            // Update existing story
            const index = currentStories.findIndex(s => s.id === story.id);
            if (index !== -1) {
              currentStories[index] = story;
              this.stories.set([...currentStories]);
            }
            this.success.set('Story updated successfully');
          } else {
            // Add new story
            this.stories.set([...currentStories, story]);
            this.success.set('Story created successfully');
          }
          
          this.isLoading.set(false);
          this.cancelForm();
          this.clearMessagesAfterDelay();
        },
        error: (error) => {
          this.error.set(`Failed to ${this.editingStory() ? 'update' : 'create'} story`);
          this.isLoading.set(false);
          console.error('Error saving story:', error);
        }
      });
    }
  }

  deleteStory(id: number): void {
    if (confirm('Are you sure you want to delete this story?')) {
      this.isLoading.set(true);
      this.clearMessages();
      
      this.storyService.deleteStory(id).subscribe({
        next: () => {
          const currentStories = this.stories();
          this.stories.set(currentStories.filter(story => story.id !== id));
          this.success.set('Story deleted successfully');
          this.isLoading.set(false);
          this.clearMessagesAfterDelay();
        },
        error: (error) => {
          this.error.set('Failed to delete story');
          this.isLoading.set(false);
          console.error('Error deleting story:', error);
        }
      });
    }
  }

  filterByProject(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    const parsedValue = selectedValue ? parseInt(selectedValue, 10) : null;
    console.log('Filter by project - Selected value:', selectedValue, 'Parsed value:', parsedValue);
    console.log('Current stories:', this.stories());
    this.selectedProjectFilter.set(parsedValue);
    
    
    this.selectedProjectFilter.set(parsedValue);
    
  }

  filterByStatus(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.selectedStatusFilter.set(selectedValue);
  }

  getProjectName(projectId: number): string {
    const project = this.projects().find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  }

  hasActiveFilters(): boolean {
    return this.selectedProjectFilter() !== null || this.selectedStatusFilter() !== '';
  }

  clearFilters(): void {
    this.selectedProjectFilter.set(null);
    this.selectedStatusFilter.set('');
  }

  private clearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.clearMessages();
    }, 3000);
  }
}
