import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Doctor } from './models/doctor';
import { Pet } from './models/pet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from './admin-service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminDashboardComponent implements OnInit {
  doctors: Doctor[] = [];
  pets: Pet[] = [];
  loading = true;
  currentImageUrl: string = '';
  
  selectedRejectionId: string | number | null = null;
  rejectionTarget: 'doctor' | 'pet' | null = null;
  statistics: any;
  rejectionMessage: string = '';

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStatistics();
  }

  loadData(): void {
    this.loading = true;
    this.adminService.getPendingData().subscribe({
      next: (data) => {
        this.doctors = data.pendingDoctors;
        this.pets = data.pendingPets;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        alert('Failed to load data.');
        this.loading = false;
      }
    });
  }

    loadStatistics(): void {
    this.adminService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (err) => {
        console.error('Failed to load statistics:', err);
      }
    });
  }

  approveDoctor(id: string): void {
    this.adminService.approveDoctor(id).subscribe({
      next: () => this.doctors = this.doctors.filter(d => d.id !== id),
      error: (err) => {
        console.error('Failed to approve doctor:', err);
        alert('Failed to approve doctor.');
      }
    });
  }

  approvePet(id: number): void {
    this.adminService.approvePet(id).subscribe({
      next: () => this.pets = this.pets.filter(p => p.id !== id),
      error: (err) => {
        console.error('Failed to approve pet:', err);
        alert('Failed to approve pet.');
      }
    });
  }

  openRejectionModal(content: TemplateRef<any>, id: string | number, type: 'doctor' | 'pet') {
    this.selectedRejectionId = id;
    this.rejectionTarget = type;
    this.rejectionMessage = '';
    this.modalService.open(content, { size: 'md' });
  }

  openImageModal(content: TemplateRef<any>, imageUrl: string) {
    this.currentImageUrl = imageUrl;
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  confirmRejection(modalRef: any): void {
    if (!this.rejectionMessage.trim()) {
      alert('Please enter a rejection message.');
      return;
    }

    if (this.rejectionTarget === 'doctor' && typeof this.selectedRejectionId === 'string') {
      this.adminService.rejectDoctor(this.selectedRejectionId, this.rejectionMessage).subscribe({
        next: () => {
          this.doctors = this.doctors.filter(d => d.id !== this.selectedRejectionId);
          modalRef.close();
        },
        error: (err) => {
          console.error('Failed to reject doctor:', err);
          alert('Failed to reject doctor.');
        }
      });
    }

    if (this.rejectionTarget === 'pet' && typeof this.selectedRejectionId === 'number') {
      this.adminService.rejectPet(this.selectedRejectionId, this.rejectionMessage).subscribe({
        next: () => {
          this.pets = this.pets.filter(p => p.id !== this.selectedRejectionId);
          modalRef.close();
        },
        error: (err) => {
          console.error('Failed to reject pet:', err);
          alert('Failed to reject pet.');
        }
      });
    }
  }

  getDoctorFullName(doctor: Doctor): string {
    return `${doctor.fName} ${doctor.lName}`;
  }

  isImage(url: string): boolean {
    if (!url) return false;
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp']
      .some(ext => url.toLowerCase().endsWith(ext));
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}