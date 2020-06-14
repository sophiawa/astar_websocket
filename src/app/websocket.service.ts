import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  dataUrl = 'assets/data.json'

  constructor(private http: HttpClient) { }

  public subject;

  public connect(url) {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Connected: " + url);
    }
    return this.subject;
  }

  public create(url) {
    let ws = new WebSocket(url);

    let observable = Observable.create(obs => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs)
      return ws.close.bind(ws);
    })

    let observer = {
      next: data => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    }

    return Subject.create(observer, observable);
  }
}
