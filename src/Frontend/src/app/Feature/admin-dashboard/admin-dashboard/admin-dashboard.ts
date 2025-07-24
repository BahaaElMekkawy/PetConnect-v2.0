import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminService } from './admin-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  imports : [CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  doctors: any[] = [];
  pets: any[] = [];
  loading = true;
  selectedCertificateUrl: string = '';

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadData();
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
        this.loading = false;
      }
    });
  }

  // Doctor actions
  approveDoctor(id: string): void {
    this.adminService.approveDoctor(id).subscribe({
      next: () => this.doctors = this.doctors.filter(d => d.id !== id),
      error: (err) => console.error('Failed to approve doctor:', err)
    });
  }

  rejectDoctor(id: string): void {
    this.adminService.rejectDoctor(id).subscribe({
      next: () => this.doctors = this.doctors.filter(d => d.id !== id),
      error: (err) => console.error('Failed to reject doctor:', err)
    });
  }

  // Pet actions
  approvePet(id: number): void {
    this.adminService.approvePet(id).subscribe({
      next: () => this.pets = this.pets.filter(p => p.id !== id),
      error: (err) => console.error('Failed to approve pet:', err)
    });
  }

  rejectPet(id: number): void {
    this.adminService.rejectPet(id).subscribe({
      next: () => this.pets = this.pets.filter(p => p.id !== id),
      error: (err) => console.error('Failed to reject pet:', err)
    });
  }

  // Certificate handling
  viewCertificate(content: any, doctorId: string): void {
    const doctor = this.doctors.find(d => d.id === doctorId);
    this.selectedCertificateUrl = 'https://localhost:7102' +doctor?.certificateUrl || '';
    this.modalService.open(content, { size: 'lg' });
  }

  // Helpers
  getDoctorFullName(doctor: any): string {
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