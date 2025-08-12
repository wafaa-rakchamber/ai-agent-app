import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  imports: [],
  templateUrl: './hello.html',
  styleUrl: './hello.scss'
})
export class Hello {
  
  onGetStarted() {
    alert('Welcome to AI Agent App! This is where your journey begins.');
  }
}
