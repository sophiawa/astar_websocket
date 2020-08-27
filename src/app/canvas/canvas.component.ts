import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Obstacle, Data } from '../data'

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  size : number = 400;
  numLines : number = 10;
  spaceBetweenLines : number = this.size / this.numLines;
  isSoln : boolean;
  noSoln : boolean = false;
  displayedProb : boolean = false;
  drawnData;
  @Input() data;
  @Input() soln;

  x : number;
  y : number;

  tempX : number;
  tempY : number;
  firstPtSelected : boolean = false;

  drawObj;
  drewSrc = false;
  drewDest = false;
  src : number[];
  dest : number[];
  obstacles : Obstacle[] = [];

  drawSolnClickTwice : boolean = false;


  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.drawGrid();
    this.activateMousePos();
  }

  incrDim() {
    if (this.numLines === 20) {
      return;
    }
    this.numLines *= 2;
    this.spaceBetweenLines /= 2;
    this.drawGrid();
    this.noSoln = false;
  }

  decrDim() {
    if (this.numLines === 5) {
      return;
    }
    this.numLines /= 2;
    this.spaceBetweenLines *= 2;
    this.drawGrid();
    this.noSoln = false;
  }

  clicked(str) {
    this.drawObj = str;
  }

  clear() {
    window.location.reload();
    this.drawGrid();
    this.drewDest = false;
    this.drewSrc = false;
    this.noSoln = false;
    this.firstPtSelected = false;
    this.obstacles = [];
  }

  drawObst() {
    if (typeof(this.drawObj) === "undefined" || this.drawObj !== "obst") {
      return;
    }
    console.log("firstPtSelected: ", this.firstPtSelected);

    if (this.firstPtSelected === false) {
      this.tempX = this.getNearestPt(this.x);
      this.tempY = this.getNearestPt(this.y);
      this.firstPtSelected = true;

      this.ctx.fillStyle = "gray";
      this.ctx.beginPath();
      this.ctx.arc(this.tempX, this.tempY,
                      3, 0, 2 * Math.PI, true);
      this.ctx.fill();
      return;
    } else {
      this.x = this.getNearestPt(this.x);
      this.y = this.getNearestPt(this.y);
      let start_x = Math.min(this.x, this.tempX);
      let start_y = Math.min(this.y, this.tempY);
      let end_x = Math.max(this.x, this.tempX);
      let end_y = Math.max(this.y, this.tempY);

      let newObst = new Obstacle(start_x / this.spaceBetweenLines, 
                                 start_y / this.spaceBetweenLines, 
                                 end_x / this.spaceBetweenLines, 
                                 end_y / this.spaceBetweenLines);

      this.obstacles.push(newObst);

      this.ctx.beginPath();
      this.ctx.fillStyle = 'gray';
      let width = end_x - start_x;
      let height = end_y - start_y;
      this.ctx.fillRect(start_x, start_y, width, height);
      console.log(newObst);
      this.ctx.stroke();

      this.firstPtSelected = false;
      return;
    }

  }

  getNearestPt(coord) {
    let pt;
    let margin = coord % this.spaceBetweenLines;
    if (margin < 10) {
      pt = coord - margin;
    } else {
      pt = (coord - margin) + this.spaceBetweenLines;
    }
    return pt;
  }


  drawPt() {
    let xPt = this.getNearestPt(this.x);
    let yPt = this.getNearestPt(this.y);
    this.ctx.font = "15px Arial";

    if (typeof(this.drawObj) === "undefined" || this.drawObj === "obst") {
      return;
    } else if (this.drawObj === "src") {
      if (this.drewSrc === true) { return; }
      this.ctx.fillStyle = "green";
      this.src = [xPt / this.spaceBetweenLines, yPt / this.spaceBetweenLines];
      this.drewSrc = true;
      this.ctx.fillText("SOURCE", xPt - 30, yPt - 12);

    } else if (this.drawObj === "dest") {
      if (this.drewDest === true) { return; }
      this.ctx.fillStyle = "red";
      this.dest = [xPt / this.spaceBetweenLines, yPt / this.spaceBetweenLines];
      this.drewDest = true;
      this.ctx.fillText("DEST", xPt - 20, yPt - 12);
    }

    this.ctx.beginPath();
    this.ctx.arc(xPt, yPt,
                    5, 0, 2 * Math.PI, true);
    this.ctx.fill();

  }

  activateMousePos() {
    let canvasElem = document.querySelector("canvas");
    canvasElem.addEventListener("click", (e) =>
    {
      let rect = canvasElem.getBoundingClientRect();
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
      //console.log("X: ", this.x, ", Y: ", this.y);

      this.drawPt();
      this.drawObst();
    });

  }

  drawSoln() {

    this.drawnData = new Data(this.src, this.dest, this.obstacles, this.numLines);
    /*
    if (this.drawSolnClickTwice === false) {
      console.log("FIRST TIME")
      this.dataService.data.next(this.drawnData.dict);
      this.drawSolnClickTwice = true;
      return;
    }
    */
    this.drawSolnClickTwice = false;
    this.dataService.data.next(this.drawnData.dict);
    this.soln = this.dataService.soln;
    console.log("data: ", this.drawnData);
    console.log("SOLUTION: ", this.soln);

    if (this.soln === false) {
      this.noSoln = true;
      return;
    }

    
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "blue";

    if (this.soln.length > 0) {
      this.ctx.moveTo(this.soln[0][0] * this.spaceBetweenLines, 
                      this.soln[0][1] * this.spaceBetweenLines);
    }

    if (this.soln.length > 1) {
      for (let i = 1; i < this.soln.length; i++) {
        this.ctx.lineTo(this.soln[i][0] * this.spaceBetweenLines,
                        this.soln[i][1] * this.spaceBetweenLines);
      }
    }

    this.ctx.stroke();

  }

  displaySoln() {
    this.dataService.data.next(this.data);
    this.soln = this.dataService.soln;
    console.log("SOLUTION: ", this.soln);
    if (typeof(this.soln) === "undefined") {
      this.isSoln = false;
      console.log("NO SOLUTION");
    } else {
      this.isSoln = true;
    }

    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "blue";

    if (this.soln.length > 0) {
      this.ctx.moveTo(this.soln[0][0], this.soln[0][1]);
    }

    if (this.soln.length > 1) {
      for (let i = 1; i < this.soln.length; i++) {
        this.ctx.lineTo(this.soln[i][0], this.soln[i][1]);
      }
    }

    this.ctx.stroke();
  }

  displayProb() {

    this.dataService.data.next(this.data);
    this.soln = this.dataService.soln;
    console.log("SOLUTIONNNN: ", this.soln);
    if (typeof(this.soln) === "undefined") {
      this.isSoln = false;
    } else {
      this.isSoln = true;
    }

    if (this.displayedProb) {
      return;
    }

    // Draw source and dest
    console.log("DISPLAYING");
    this.ctx.beginPath();
    this.ctx.arc(this.data.source[0], this.data.source[1],
                    5, 0, 2 * Math.PI, true);
    this.ctx.fillStyle = 'green';
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.data.dest[0], this.data.dest[1],
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
      this.ctx.fillRect(x, y, width, height);
      this.ctx.stroke();
    }

    this.displayedProb = true;
  }

  drawGrid() {
    this.ctx.clearRect(0, 0, this.size, this.size);

    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1; 
    
    for (let i = this.spaceBetweenLines; i < this.size; i+=this.spaceBetweenLines) {
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
