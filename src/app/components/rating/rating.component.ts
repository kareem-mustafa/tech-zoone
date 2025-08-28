import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {
  @Input() max = 5;
  @Input() value = 0;
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<number>();

  stars: number[] = [];

  ngOnInit(): void {
    this.stars = Array(this.max).fill(0);
  }

  setRating(newValue: number, event: MouseEvent) {
    event.stopPropagation(); // 🛑 يمنع الكليك من التوريث للكارد
    if (this.readonly) return;
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
