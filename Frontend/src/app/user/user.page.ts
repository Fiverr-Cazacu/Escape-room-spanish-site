import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
})
export class UserPage {
  data: any = {
    title: 'Escape room',
    questions: [
      {
        question: 'Cine este Iohannis?',
        answer: 'jmecher',
        clue: 'barosan',
      },
      {
        question: 'Cine este Putin?',
        answer: 'jmecher',
        clue: 'barosan',
      },
      {
        question: 'Cine este Trump?',
        answer: 'jmecher',
        clue: 'barosan',
      },
    ],
    deadline: new Date('Sept 5, 2023 16:30:00').getTime(),
    isFinished: false
  };
  answers: any = [];
  answerForm = this._fb.group({
    answer: ['', [Validators.required]]
  });
  currentQuestion: number = 0;
  isClue: boolean = false;

  hours: string = '';
  minutes: string = '';
  seconds: string = '';
  distance: number = 1;

  calcTime = setInterval(() => {
    var now = new Date().getTime();
    var distance = this.data.deadline - now;
    this.distance = distance;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.hours = hours.toString();
    this.minutes = minutes.toString().padStart(2, '0');
    this.seconds = seconds.toString().padStart(2, '0');
  }, 1000);

  constructor(private _fb: FormBuilder) {
  }

  onSubmit() {
    if (this.answerForm.valid) {
      if (this.currentQuestion >= this.data.questions.length - 1) {
        this.data.isFinished = true;
        this.answers.push(this.answerForm.value);
        console.log(this.answers);
      } else {
        this.currentQuestion++;
        this.answers.push(this.answerForm.value);
        this.answerForm.reset();
        this.isClue = false;
      }
    }
  }
}
