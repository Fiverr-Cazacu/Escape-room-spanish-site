import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { link } from '../link';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
})
export class UserPage {

  sessionID: string | null = '';
  teamID: string | null = '';

  clue: string = '';

  data: any = {
    room: '',
    title: '',
    questions: [],
    deadline: new Date('Sept 8, 2023 16:30:00').getTime(),
    isFinished: false,
    score: 0
  };
  answers: any = [];
  answerForm = this._fb.group({
    answer: ['', [Validators.required]]
  });
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

  constructor(private _fb: FormBuilder, private _route: ActivatedRoute, private _http: HttpClient) {
  }

  ngOnInit() {
    this.sessionID = this._route.snapshot.paramMap.get('sessionID');
    this.teamID = this._route.snapshot.paramMap.get('teamID');

    this._http.get(link+'teams/'+this.teamID+'?sessionId='+this.sessionID).subscribe({
      next: (val: any) => {
        let ok = false;
        for (let question of val.questions) {
          if (question.answered == 'no') {
            ok = true;
          }
        }

        if (!ok) {
          window.location.href = '../ended?score=' + val.score;
        }

        this.data.title = val.teamName;
        this.data.room = val.roomName;
        this.data.questions = val.questions;
        this.data.deadline = val.deadline;
        this.data.score = val.score;
        console.log(val)
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  onSubmit(index: number) {
    if (this.data.questions[index].answered == 'no' && this.answerForm.valid) {
      this._http.post(link+'teams/submit/'+this.teamID+'?sessionId='+this.sessionID, {index: index, answer: this.answerForm.controls.answer.value}).subscribe({
        next: (val: any) => {
          window.location.reload();
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  }

  requestClue(index: number) {
    if (this.data.questions[index].clue == null) {
      this._http.post(link+'teams/clue/'+this.teamID+'?sessionId='+this.sessionID, {index: index}).subscribe({
        next: (val: any) => {
          window.location.reload();
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  }

  giveUp(index: number) {
    if (this.data.questions[index].answered == 'no') {
      this._http.post(link+'teams/giveup/'+this.teamID+'?sessionId='+this.sessionID, {index: index}).subscribe({
        next: (val: any) => {
          window.location.reload();
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  }
}
