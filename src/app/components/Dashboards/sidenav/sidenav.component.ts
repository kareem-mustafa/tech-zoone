import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleClick() {
    this.toggleSidebar.emit();
  }
}
