import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../../services/auth.service';

export interface UserProfile {
  username: string;
  preferredName: string;
  email: string;
  address: string;
  mobileNumber: string;
}

@Component({
  selector: 'app-profile-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-settings-modal.component.html',
  styleUrls: ['./profile-settings-modal.component.scss']
})
export class ProfileSettingsModalComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserProfile>();

  profile: UserProfile = {
    username: '',
    preferredName: '',
    email: '',
    address: '',
    mobileNumber: ''
  };

  // Visibility toggles for sensitive fields
  showEmail = false;
  showMobileNumber = false;
  showAddress = false;

  ngOnInit() {
    console.log('User data received in modal:', this.user);
    if (this.user) {
      this.profile = {
        username: this.user.name || '',
        preferredName: this.user.preferredName || '',
        email: this.user.email || '',
        address: this.user.address || '',
        mobileNumber: this.user.mobileNumber || ''
      };
      console.log('Profile initialized:', this.profile);
    }
  }

  // Mask email: show first 2 chars and domain, hide the rest
  getMaskedEmail(): string {
    if (!this.profile.email) return '';
    if (this.showEmail) return this.profile.email;
    
    const [localPart, domain] = this.profile.email.split('@');
    if (!domain) return this.profile.email;
    
    const visibleChars = Math.min(2, localPart.length);
    const masked = localPart.substring(0, visibleChars) + '****';
    return `${masked}@${domain}`;
  }

  // Mask mobile number: show last 4 digits
  getMaskedMobileNumber(): string {
    if (!this.profile.mobileNumber) return '';
    if (this.showMobileNumber) return this.profile.mobileNumber;
    
    const length = this.profile.mobileNumber.length;
    if (length <= 4) return this.profile.mobileNumber;
    
    const lastFour = this.profile.mobileNumber.slice(-4);
    return '****' + lastFour;
  }

  // Mask address: show first 15 chars
  getMaskedAddress(): string {
    if (!this.profile.address) return '';
    if (this.showAddress) return this.profile.address;
    
    if (this.profile.address.length <= 15) return this.profile.address;
    return this.profile.address.substring(0, 15) + '...';
  }

  toggleEmailVisibility() {
    this.showEmail = !this.showEmail;
  }

  toggleMobileNumberVisibility() {
    this.showMobileNumber = !this.showMobileNumber;
  }

  toggleAddressVisibility() {
    this.showAddress = !this.showAddress;
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.save.emit(this.profile);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
