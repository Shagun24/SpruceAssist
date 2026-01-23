import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, AuthService } from '../../../../services/auth.service';
import { ProfileSettingsModalComponent, UserProfile } from './profile-settings-modal/profile-settings-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ProfileSettingsModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() currentUser: User | null = null;
  @Output() logout = new EventEmitter<void>();

  showUserMenu = false;
  showProfileModal = false;

  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.logout.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  openProfileSettings(event: Event): void {
    event.preventDefault();
    this.showProfileModal = true;
    this.showUserMenu = false;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  saveProfileSettings(profile: UserProfile): void {
    this.authService.updateUserProfile({
      name: profile.username,
      preferredName: profile.preferredName,
      email: profile.email,
      address: profile.address,
      mobileNumber: profile.mobileNumber
    });
    this.showProfileModal = false;
  }
}
