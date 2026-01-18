
export enum Language {
  FR = 'FR',
  EN = 'EN'
}

export enum Tab {
  DASHBOARD = 'dashboard',
  WALLET = 'wallet',
  TRANSFERS = 'transfers',
  CARDS = 'cards',
  PROFILE = 'profile',
  STATISTICS = 'statistics',
  CASHBACK = 'cashback',
  SUPPORT = 'support',
  SETTINGS = 'settings'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Account {
  id: string;
  type: string;
  balance: number;
  currency: string;
  accountNumber: string;
}

export interface Transaction {
  id: string;
  date: string;
  recipient: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  category: string;
  logo?: string;
  status?: 'completed' | 'failed';
}

export interface Card {
  id: string;
  type: 'Visa' | 'Mastercard';
  number: string;
  expiry: string;
  holder: string;
  status: 'active' | 'frozen';
  balance: number;
  currency: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  currency: string;
}

export interface CashbackCategory {
  id: string;
  name: string;
  rate: number; // percentage
  logo: string; // url or icon name
  category: string;
}

export interface Notification {
  id: string;
  message: string;
  date: Date;
  read: boolean;
}