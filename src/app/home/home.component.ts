import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

export interface SubmissionData {
  loading_location: string;
  loading_date: string | undefined;
  loading_time: string;
  unloading_location: string;
  unloading_date: string | undefined;
  unloading_time: string;
  price: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  service = inject(AuthService);

  languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' }
  ];

  selectedLanguage!: string;

  loadingLocations: any[] = [];
  unloadingLocations: any[] = [];
  filteredLoadingLocations: any[] = [];
  filteredUnloadingLocations: any[] = [];

  selectedLoadingLocation!: string;
  selectedLoadingDate!: string | undefined;
  selectedLoadingTime!: string;

  selectedUnloadingLocation!: string;
  selectedUnloadingDate!: string | undefined;
  selectedUnloadingTime!: string;

  selectedPrice!: number;  // Price is now a number
  deliveryTimes: string[] = this.generateDeliveryTimes();

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  ngOnInit(): void {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
    } else {
      this.selectedLanguage = 'en';
    }

    // Fetch locations when the component initializes
    this.getAvailableCities().subscribe(locations => {
      this.loadingLocations = locations;
      this.unloadingLocations = locations;
    });
  }

  // Submit Handler
  onSubmit(): void {
    const formattedLoadingDate = this.formatDateToYYMMDD(this.selectedLoadingDate);
    const formattedUnloadingDate = this.formatDateToYYMMDD(this.selectedUnloadingDate);
    
    const submissionData = this.prepareDataForSubmission();
    
    // Update the submission data with the formatted date
    submissionData.loading_date = formattedLoadingDate;
    submissionData.unloading_date = formattedUnloadingDate;
  
    console.log(submissionData); // Send this data to the backend API
  }
  

  // Prepare data for submission
  prepareDataForSubmission(): SubmissionData {
    return {
      loading_location: this.selectedLoadingLocation,
      loading_date: this.selectedLoadingDate,
      loading_time: this.selectedLoadingTime,
      unloading_location: this.selectedUnloadingLocation,
      unloading_date: this.selectedUnloadingDate,
      unloading_time: this.selectedUnloadingTime,
      price: this.selectedPrice
    };
  }

  formatDateToYYMMDD(date: string | undefined): string | undefined {
    if (date) {
      const formattedDate = this.datePipe.transform(date, 'YYYY-MM-dd');
      return formattedDate !== null ? formattedDate : undefined; // Ensure the result is not null
    }
    return undefined; // Return undefined if date is falsy
  }
  

  // Language change handler
  getAvailableCities(): Observable<any[]> {
    return this.service.getAvailableCities();
  }

  generateDeliveryTimes(): string[] {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        times.push(
          `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        );
      }
    }
    return times;
  }

  filterLocations(event: Event, type: 'loading' | 'unloading'): void {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    const filteredLocations = (type === 'loading' ? this.loadingLocations : this.unloadingLocations)
      .filter(location => location.city.toLowerCase().includes(query.toLowerCase()));

    if (type === 'loading') {
      this.filteredLoadingLocations = filteredLocations;
    } else {
      this.filteredUnloadingLocations = filteredLocations;
    }
  }

  onLanguageChange(event: any): void {
    const language = event.value;
    localStorage.setItem('selectedLanguage', language); // Save to localStorage
    this.selectedLanguage = language;
    // You can also add logic to update the language throughout your app, e.g., by triggering a translation reload.
  }
}
