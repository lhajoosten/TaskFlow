import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss'
})
export class EmailConfirmationComponent implements OnInit {
  message = 'Processing confirmation...';

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    const email = this.route.snapshot.queryParams['email'];
    const token = this.route.snapshot.queryParams['token'];

    this.authService.confirmEmail(email, token).subscribe(
      () => this.message = '✅ Email Confirmed Successfully!',
      () => this.message = '❌ Email Confirmation Failed!'
    );
  }
}