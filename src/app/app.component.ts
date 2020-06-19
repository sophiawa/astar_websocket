import { Component } from '@angular/core';
import { WebsocketService } from './websocket.service'
import { DataService } from './data.service'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'title';
  soln;

  constructor(private dataService: DataService, private http: HttpClient) {
    dataService.data.subscribe(data => {
      console.log("Response from websocket: " + data);
    })
  }
  
  public data1 = this.http.get('../assets/data.json').subscribe(
    data => this.data1 = {
      source: data["source"],
      dest: data["dest"],
      obstacles: data["obstacles"]
    }
  )
  
  /*
  sendMsg() {
    console.log("new data from client to websocket");
    this.dataService.data.next(this.data1);
    this.soln = this.dataService.soln;
    console.log("Data1: ", this.data1);
    console.log("Solution: ", this.soln);
  }*/
  
}
