import { Component } from '@angular/core';

@Component({
  selector: 'app-ended',
  templateUrl: './ended.component.html'
})
export class EndedComponent {
  getScore() {
    return new URLSearchParams(document.location.search).get('score');
  }
}
