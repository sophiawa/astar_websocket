import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from '../data.service'

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  size : number = 400;
  isSoln;
  displayedProb = false;
  @Input() data;
  @Input() soln;

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.drawGrid();
  }

  displaySoln() {
    console.log("SOLUTION: ", this.soln);

    if (typeof(this.soln) === "undefined") {
      return;
    }

    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "blue";

    if (this.soln.length > 0) {
      this.ctx.moveTo(this.soln[0][0] * 20, this.soln[0][1] * 20);
    }

    if (this.soln.length > 1) {
      for (let i = 1; i < this.soln.length; i++) {
        this.ctx.lineTo(this.soln[i][0] * 20, this.soln[i][1] * 20);
      }
    }

    this.ctx.stroke();
  }

  displayProb() {

    if (this.displayedProb) {
      return;
    }

    // Initialize data and solution
    this.soln = this.dataService.soln;
    this.dataService.data.next(this.data);
    if (typeof(this.soln) === "undefined") {
      this.isSoln = false;
    } else {
      this.isSoln = true;
    }

    // Draw source and dest
    console.log("DISPLAYING");
    this.ctx.beginPath();
    this.ctx.arc(this.data.source[0], this.data.source[1],
                    5, 0, 2 * Math.PI, true);
    this.ctx.fillStyle = 'green';
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.data.dest[0] * 20, this.data.dest[1] * 20,
                    5, 0, 2 * Math.PI, true);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();

    // Draw obstacles
    for (let obst of this.data.obstacles) {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'gray';
      let width = obst.end_x - obst.start_x;
      let height = obst.end_y - obst.start_y;
      let x = obst.start_x;
      let y = obst.start_y;
      this.ctx.fillRect(x * 20, y * 20, width * 20, height * 20);
      this.ctx.stroke();
    }

    this.displayedProb = true;
  }

  drawGrid() {
    this.ctx.lineWidth = 1; 
    for (let i = 0; i < this.size; i+=20) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.size, i);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.size);
      this.ctx.stroke();
    }
  }

}
