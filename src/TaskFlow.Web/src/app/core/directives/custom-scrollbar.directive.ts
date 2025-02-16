import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollbar]',
  standalone: true,
})
export class CustomScrollbarDirective implements OnInit {
  @Input() variant: 'primary' | 'dark' | 'light' = 'primary';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element = this.el.nativeElement;
    element.classList.add(`scrollbar-${this.variant}`);
  }
}
