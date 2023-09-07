import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
})
export class UserPage {

  sessionID: string | null = '';
  teamID: string | null = '';

  clue: string = '';

  data: any = {
    title: '',
    question: '',
    deadline: new Date('Sept 8, 2023 16:30:00').getTime(),
    isFinished: false
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

    console.log(699)

    this._http.get('http://localhost:8000/api/teams/'+this.teamID+'?sessionId='+this.sessionID).subscribe({
      next: (val: any) => {
        this.data.title = val.name;
        //this.data.deadline = val.end;
        //console.log(val.end)
      },
      error: (err) => {
        console.log(err)
      }
    });

    this._http.get('http://localhost:8000/api/teams/state/'+this.teamID+'?sessionId='+this.sessionID).subscribe({
      next: (val: any) => {
        this.data.question = val.statement;
        console.log(val)
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  onSubmit() {
    
  }

  requestClue() {
    if (this.clue == '') {
      this._http.get('http://localhost:8000/api/teams/clue/'+this.teamID+'?sessionId='+this.sessionID).subscribe({
        next: (val: any) => {
          this.clue = val.clue
          console.log(val)
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  }

  giveUp() {
    this._http.get('http://localhost:8000/api/teams/giveup/'+this.teamID+'?sessionId='+this.sessionID).subscribe({
      next: (val: any) => {
        console.log(val)
        window.location.reload();
      },
      error: (err) => {
        console.log(err)
      }
    });
  }
}
