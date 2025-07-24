import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

interface Doctor {
  id: string;
  fName: string;
  lName: string;
  imgUrl: string;
  petSpecialty: string;
  gender: string;
  pricePerHour: number;
  certificateUrl: string;
  isApproved: boolean;
}

interface Pet {
  id: number;
  name: string;
  imgUrl: string;
  breadName: string;
  categoryName: string;
  isApproved: boolean;
}

interface AdminData {
  pendingDoctors: Doctor[];
  pendingPets: Pet[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getPendingData(): Observable<AdminData> {
    return this.http.get<{ data: AdminData }>(`${environment.apiBaseUrl}/Admin`).pipe(
      map(response => response.data)
    );
  }

  approveDoctor(id: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/Admin/approve-doctor/${id}`, {});
  }

  rejectDoctor(id: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/Admin/reject-doctor/${id}`, {});
  }

  approvePet(id: number): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/Admin/approve-pet/${id}`, {});
  }

  rejectPet(id: number): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/Admin/reject-pet/${id}`, {});
  }
}