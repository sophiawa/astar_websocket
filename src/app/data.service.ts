import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from './websocket.service'

import { Observable, throwError, Subject } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

const URL = "ws://localhost:8000"

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public data;
  public soln;

  constructor(wsService: WebsocketService) {
    console.log('before connecting?')
    this.data = wsService.connect(URL).pipe(map(
      response => {
        const r : any = response;
        console.log('=============');
        console.log(r);
        console.log('????????????');
        let data = JSON.parse(r.data);
        console.log(data.soln);
        console.log('!!!!!!!!!!!!');
        this.soln = data.soln;
        return {
          soln: data.soln
        }
      }
    ))
  }
}
