import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as Rx from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements AfterViewInit {
  sub: Rx.Subscription;
  /** Template reference to the canvas element */
  @ViewChild('canvasEl') canvasEl: ElementRef;
  
  /** Canvas 2d context */
   canvas: HTMLCanvasElement;
   context: CanvasRenderingContext2D;

  /** ball vars **/
   x = 0;
   y = 0;
   dx = 2;
   dy = -2;
   ballRad = 10;
   rgb = {r: 0, g: 0, b: 0}

  /** paddle vars **/
   paddleHeight = 10;
   paddleWidth = 75;
   paddleX = 0;
   lPressed = false;
   rPressed = false;

  constructor() {}

  ngAfterViewInit() {
    this.canvas = this.canvasEl.nativeElement;
    this.context = this.canvas.getContext('2d');

    this.x = this.canvas.width/2;
    this.y = this.canvas.height-30;

    this.paddleX = (this.canvas.width-this.paddleWidth)/2;

    document.addEventListener("keydown",  (e) => this.keyDownHandler(e), false);
    document.addEventListener("keyup", (e) => this.keyUpHandler(e), false);
  
    this.sub = Rx.Observable
      .interval(10)
      .timeInterval()
      .subscribe(() => this.draw());
  }

  /**
   * Draws something using the context we obtained earlier on
   */
  protected draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBall();
    this.drawPaddle();

    if(this.x + this.dx > this.canvas.width - this.ballRad || this.x + this.dx < this.ballRad) {
        this.dx = -this.dx;
        this.randomColor();
    }
  
    if(this.y + this.dy < this.ballRad) {
        this.dy = -this.dy;
        this.randomColor();
    } else if(this.y + this.dy > this.canvas.height - this.ballRad) {
      if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
        this.dy = -this.dy;
      } else {
        this.sub.unsubscribe();
        alert("GAME OVER");
        document.location.reload();
      }
    }

    if (this.rPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
      this.paddleX += 7;
    } else if(this.lPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  protected drawBall() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.ballRad, 0, Math.PI*2);
    this.context.fillStyle = `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
    this.context.fill();
    this.context.closePath();
  }

  protected randomColor() {
    this.rgb.r = Math.floor(Math.random() * 255);
    this.rgb.g = Math.floor(Math.random() * 255);
    this.rgb.b = Math.floor(Math.random() * 255);
  }

  protected drawPaddle() {
    this.context.beginPath();
    this.context.rect(this.paddleX, this.canvas.height-this.paddleHeight, this.paddleWidth, this.paddleHeight);
    this.context.fillStyle = "#0095DD";
    this.context.fill();
    this.context.closePath();
  }

  protected keyDownHandler(e) {
    if(e.keyCode == 39) {
        this.rPressed = true;
    }
    else if(e.keyCode == 37) {
        this.lPressed = true;
    }
  }
  protected keyUpHandler(e) {
    if(e.keyCode == 39) {
        this.rPressed = false;
    }
    else if(e.keyCode == 37) {
        this.lPressed = false;
    }
  }
}
