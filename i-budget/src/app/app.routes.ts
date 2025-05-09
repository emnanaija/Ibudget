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
import {
  PageDesDepensesComponent
} from './FrontOffice/dashboard/components/pages/page-des-depenses/page-des-depenses.component';
import {
  ExpenseCategoryPageComponent
} from './FrontOffice/dashboard/components/pages/expense-categories/expense-category-page/expense-category-page.component';
import {FetePageComponent} from './FrontOffice/dashboard/components/pages/fete-page/fete-page.component';
import {
  PageDepensesReccurentesComponent
} from './FrontOffice/dashboard/components/pages/depenses-reccurentes/page-depenses-reccurentes/page-depenses-reccurentes.component';
import {PageDesDepensesComponentback} from './BackOffice/pages/page-des-depenses/page-des-depenses.component';
import {
  PageDepensesReccurentesComponentback
} from './BackOffice/pages/depenses-reccurentes/page-depenses-reccurentes/page-depenses-reccurentes.component';
import {
  ExpenseCategoryPageComponentback
} from './BackOffice/pages/expense-categories/expense-category-page/expense-category-page.component';
import {FetePageComponentback} from './BackOffice/pages/fete-page/fete-page.component';
import {WalletPageComponent} from './BackOffice/pages/Expensewallet/wallet-page/wallet-page.component';
import {
  PagepredictionComponent
} from './FrontOffice/dashboard/components/pages/predictioncateg/pageprediction/pageprediction.component';
import {
  CompteEpargnePageComponent
} from './Pages/saving/compte-epargne/compte-epargne-page/compte-epargne-page.component';
import {DepotPageComponent} from './Pages/saving/depot-page/depot-page.component';
import {ObjectifPageComponent} from './Pages/saving/objectif-page/objectif-page.component';
import {CompteEpargneListComponent} from './BackOffice/saving/compte-epargne-list/compte-epargne-list.component';
import {ScheduledTransactionComponent} from './FrontOffice/ScheduledTransactions/scheduled-transaction.component';
import {BillPaymentComponent} from './FrontOffice/BillsAndPayment/bill-payment.component';

// Import other components as needed

export const routes: Routes = [

  //routes amine
  {path: 'saving', component: CompteEpargnePageComponent},
  {path: 'depot', component:DepotPageComponent},
  {path:'objectif', component:ObjectifPageComponent},
    {path:'savingAd',component:CompteEpargneListComponent},

  // routes emna
  //frontend
  { path: 'depenses', component: PageDesDepensesComponent },
  { path: 'ajoutercategorie', component: ExpenseCategoryPageComponent },
  { path: 'fetes', component: FetePageComponent },  // Définir la route pour la page des fêtes
  { path: 'depensesReccurentes', component:PageDepensesReccurentesComponent  },  // Définir la route pour la page des fêtes
  //backend
  { path: 'depensesReccurentesback', component:PageDepensesReccurentesComponentback  } , // Définir la route pour la page des fêtes
  { path: 'depensesback', component: PageDesDepensesComponentback },
  { path: 'ajoutercategorieback', component: ExpenseCategoryPageComponentback },
  { path: 'fetesback', component: FetePageComponentback },
  { path: 'wallets', component: WalletPageComponent },
  //prediction
  { path: 'predict', component: PagepredictionComponent },
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
  {path: 'billpay', component: BillPaymentComponent},
  {
    path: 'transactionsFront',
    component: CreateTransactionFrontComponent
  },
  {
    path: 'Scheduled',
    component: ScheduledTransfersComponent
  },
  {
    path: 'ScheduledFront',
    component: ScheduledTransactionComponent
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



