import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './BackOffice/dashboardAdmin/dashboardAdmin.component';
import {AccountsManagementComponent} from './BackOffice/accounts/accounts-management/accounts-management.component';
import {AccountListComponent} from './BackOffice/accounts/account-list/account-list.component';
import {AccountDetailsComponent} from './BackOffice/accounts/account-details/account-details.component';
import {AccountCreateComponent} from './BackOffice/accounts/account-create/account-create.component';
import {RechargeAccountComponent} from './BackOffice/accounts/recharge-account/recharge-account.component';
import {DashboardComponent} from './FrontOffice/dashboard/dashboard.component';
import {TransactionManagementComponent} from './BackOffice/transactions/transaction-management.component';

// Import transaction-related components
import { TransactionListComponent } from './BackOffice/transactions/transaction-list/transaction-list.component';
import { CreateTransactionComponent } from './BackOffice/transactions/create-transaction/create-transaction.component';
import { ScheduledTransfersComponent } from './BackOffice/transactions/scheduled-transfers/scheduled-transfers.component';
import { BatchTransactionsComponent } from './BackOffice/transactions/batch-transactions/batch-transactions.component';
import {noAuthGuard} from './services/User/no-auth.guard';
import {SignupRegisterComponent} from './Pages/signup-register/signup-register.component';
import {CompleteProfileComponent} from './Pages/complete-profile/complete-profile.component';
import {SocialLoginSuccessComponent} from './Pages/social-login-success/social-login-success.component';
import {AuthGuard} from './services/User/auth.guard';
import {ResetPasswordComponent} from './Pages/reset-password/reset-password.component';
import {ApproveNewDeviceComponent} from './Pages/approve-new-device/approve-new-device.component';
import {ActivateAccountComponent} from './Pages/activate-account/activate-account.component';
import { CreateTransactionFrontComponent } from './FrontOffice/TransactionsFront/create-transaction-front.component';
import { AccountFrontComponent } from './FrontOffice/AccountsFront/account-front.component';
import { SubscriptionFrontComponent } from './FrontOffice/SubscriptionsFront/subscription-front.component';
import {CoinListComponent} from './FrontOffice/dashboard/components/investment/coin/coin-list/coin-list.component';
import {
  CoinDetailComponent
} from './FrontOffice/dashboard/components/investment/coin/coin-detail/coin-detail.component';
import {WalletComponent} from './FrontOffice/dashboard/components/investment/wallet/wallet.component';
import {
  PaymentSuccessComponent
} from './FrontOffice/dashboard/components/investment/payment-success/payment-success.component';
import {
  InvestmentPortfolioComponent
} from './FrontOffice/dashboard/components/investment/investment-portfolio/investment-portfolio.component';
import {InvestmentComponent} from './BackOffice/investment/investment.component';

// Import other components as needed

export const routes: Routes = [
  { path: 'investment', component: InvestmentComponent },
  { path: 'coins', component: CoinListComponent },
  { path: 'coins/details/:coinId', component: CoinDetailComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'portfolio', component: InvestmentPortfolioComponent },

  //----------------------------------------
  {
    path: 'signupRegister',
    component: SignupRegisterComponent,
    canActivate:[noAuthGuard]
  },
  {
    path: 'transactionsFront',
    component: CreateTransactionFrontComponent
  },
  {
    path: 'subscription',
    component: SubscriptionFrontComponent
  },
  {
    path: 'dashboardfront',
    component: DashboardComponent,

  },
  {
    path: 'accountfront',
    component: AccountFrontComponent
  },
  {
    path: 'activateAccount',
    component: ActivateAccountComponent
  },
  {
    path: 'approveNewDevice',
    component: ApproveNewDeviceComponent
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent
  },



  {
    path: 'social-login-success',
    component: SocialLoginSuccessComponent
  },{
    path:'completeProfile',
    component:CompleteProfileComponent
  },
  { path: 'dashboard', component: DashboardAdminComponent },
  { path: 'dashboardfront', component: DashboardComponent },
  {
    path: 'accounts',
    component: AccountsManagementComponent,
    children: [
      { path: 'list', component: AccountListComponent },
      { path: 'details/:id', component: AccountDetailsComponent },
      { path: 'create', component: AccountCreateComponent },
      { path: 'recharge', component: RechargeAccountComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'transactions',
    component: TransactionManagementComponent,
    children: [
      { path: 'list', component: TransactionListComponent },
      { path: 'create', component: CreateTransactionComponent },
      { path: 'scheduled', component: ScheduledTransfersComponent },
      { path: 'batch', component: BatchTransactionsComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/signupRegister', pathMatch: 'full' },

  // Other routes
];



