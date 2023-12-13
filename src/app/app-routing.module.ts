import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then( m => m.BlogPageModule)
  },
  {
    path: 'blog/:id',
    loadChildren: () => import('./blog-detail/blog-detail.module').then( m => m.BlogDetailPageModule)
  },
  {
    path: 'signup/step1',
    loadChildren: () => import('./signup/step1/step1.module').then( m => m.Step1PageModule)
  },
  {
    path: 'signup/step2',
    loadChildren: () => import('./signup/step2/step2.module').then( m => m.Step2PageModule)
  },
  {
    path: 'signup/step3',
    loadChildren: () => import('./signup/step3/step3.module').then( m => m.Step3PageModule)
  },
  {
    path: 'signup/step4',
    loadChildren: () => import('./signup/step4/step4.module').then( m => m.Step4PageModule)
  },
  {
    path: 'signup/final',
    loadChildren: () => import('./signup/final/final.module').then( m => m.FinalPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot/forgot.module').then( m => m.ForgotPageModule)
  },
  {
    path: 'user/dashboard',
    loadChildren: () => import('./user/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'user/paynow',
    loadChildren: () => import('./user/paynow/paynow.module').then( m => m.PaynowPageModule)
  },
  {
    path: 'user/topup',
    loadChildren: () => import('./user/topup/topup.module').then( m => m.TopupPageModule)
  },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // },
  {
    path: 'user/contact-info',
    loadChildren: () => import('./user/contact-info/contact-info.module').then( m => m.ContactInfoPageModule)
  },
  {
    path: 'user/fedphoneline-info',
    loadChildren: () => import('./user/fedphoneline-info/fedphoneline-info.module').then( m => m.FedphonelineInfoPageModule)
  },
  {
    path: 'user/change-password',
    loadChildren: () => import('./user/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'user/call-forwarding',
    loadChildren: () => import('./user/call-forwarding/call-forwarding.module').then( m => m.CallForwardingPageModule)
  },
  {
    path: 'user/upgrade',
    loadChildren: () => import('./user/upgrade/upgrade.module').then( m => m.UpgradePageModule)
  },
  {
    path: 'user/terminate',
    loadChildren: () => import('./user/terminate/terminate.module').then( m => m.TerminatePageModule)
  },
  {
    path: 'user/auto-recharge',
    loadChildren: () => import('./user/auto-recharge/auto-recharge.module').then( m => m.AutoRechargePageModule)
  },
  {
    path: 'user/credit-card',
    loadChildren: () => import('./user/credit-card/credit-card.module').then( m => m.CreditCardPageModule)
  },
  {
    path: 'user/order',
    loadChildren: () => import('./user/order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'user/invoice',
    loadChildren: () => import('./user/invoice/invoice.module').then( m => m.InvoicePageModule)
  },
  {
    path: 'user/referral',
    loadChildren: () => import('./user/referral/referral.module').then( m => m.ReferralPageModule)
  },
  {
    path: 'user/call-time',
    loadChildren: () => import('./user/call-time/call-time.module').then( m => m.CallTimePageModule)
  },
  {
    path: 'user/new-number',
    loadChildren: () => import('./user/new-number/new-number.module').then( m => m.NewNumberPageModule)
  },
  {
    path: 'page/pricing',
    loadChildren: () => import('./page/pricing/pricing.module').then( m => m.PricingPageModule)
  },
  {
    path: 'page/contact-us',
    loadChildren: () => import('./page/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'page/faqs',
    loadChildren: () => import('./page/faqs/faqs.module').then( m => m.FaqsPageModule)
  },
  {
    path: 'page/jail-news',
    loadChildren: () => import('./page/jail-news/jail-news.module').then( m => m.JailNewsPageModule)
  },
  {
    path: 'page/billing-calculator',
    loadChildren: () => import('./page/billing-calculator/billing-calculator.module').then( m => m.BillingCalculatorPageModule)
  },
  {
    path: 'page/correcttional',
    loadChildren: () => import('./page/correcttional/correcttional.module').then( m => m.CorrecttionalPageModule)
  },
  {
    path: 'page/correcttional/:slug',
    loadChildren: () => import('./page/correctional-detail/correctional-detail.module').then( m => m.CorrectionalDetailPageModule)
  },
  {
    path: 'blog-detail',
    loadChildren: () => import('./blog-detail/blog-detail.module').then( m => m.BlogDetailPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'confirm',
    loadChildren: () => import('./signup/confirm/confirm.module').then( m => m.ConfirmPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
