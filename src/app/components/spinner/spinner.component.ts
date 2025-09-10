import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div *ngIf="loading$ | async" class="spinner-overlay">
      <div class="spinner-box">
        <div class="cart-icon">🛒</div>
        <div class="dots">
          <div class="dot dot1"></div>
          <div class="dot dot2"></div>
          <div class="dot dot3"></div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
      <p class="spinner-text">Loading ...</p>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: 9999;
    }

    .spinner-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .cart-icon {
      font-size: 4rem;
      animation: bounceCart 1s infinite alternate;
      text-shadow: 0 0 10px #3b82f6, 0 0 20px #1e3a8a;
      color: #3b82f6;
    }

    @keyframes bounceCart {
      0% { transform: translateY(0); }
      100% { transform: translateY(-15px); }
    }

    .dots {
      display: flex;
      gap: 15px;
    }

    .dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(45deg, #3b82f6, #06b6d4, #9333ea);
      box-shadow: 0 0 8px #3b82f6, 0 0 12px #06b6d4, 0 0 16px #9333ea;
      animation: bounce 1.2s infinite ease-in-out;
    }

    .dot1 { animation-delay: 0s; }
    .dot2 { animation-delay: 0.2s; }
    .dot3 { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }

    .progress-bar {
      width: 80px;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
      margin-top: 10px;
    }

    .progress-fill {
      width: 0;
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #06b6d4, #9333ea);
      animation: fill 1.2s infinite;
    }

    @keyframes fill {
      0% { width: 0; }
      50% { width: 100%; }
      100% { width: 0; }
    }

    .spinner-text {
      margin-top: 15px;
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      text-align: center;
      text-shadow: 0 0 5px #3b82f6;
    }

    /* Responsive */
    @media(max-width: 768px){
      .cart-icon { font-size: 3rem; }
      .dot { width: 14px; height: 14px; }
      .progress-bar { width: 60px; height: 3px; }
      .spinner-text { font-size: 1rem; }
    }
  `]
})
export class SpinnerComponent {
  loading$: Observable<boolean>;
  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
