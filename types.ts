export type ViewType = 'home' | 'spending' | 'planning' | 'union' | 'share' | 'profile';
export type SpendingSubTab = 'dépenses' | 'économies' | 'courses' | 'dettes' | 'analyse';

export interface Expense {
  id: string;
  name: string;
  jean: number;
  monique: number;
  settled: boolean;
  category: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  bought: boolean;
  shared: boolean;
  listName: string;
}

export interface Debt {
  id: string;
  from: string;
  to: string;
  amount: number;
  reason: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  desc: string;
  place: string;
  category: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  content: string;
  lead: string;
}

export interface Chore {
  id: string;
  title: string;
  points: number;
}

export interface Reward {
  id: string;
  title: string;
  threshold: number;
}

export interface AchievedReward {
  id: string;
  rewardTitle: string;
  winnerName: string;
  date: string;
}

export interface ChoreHistoryEntry {
  id: string;
  choreId: string;
  choreTitle: string;
  userName: string;
  points: number;
  date: string; // ISO string for sorting/filtering
}

export interface UserSettings {
  p1Name: string;
  p2Name: string;
  theme: 'classic' | 'pink' | 'dark';
  p1Income: number;
  p2Income: number;
  targetBudget: number;
  currency: string;
  email: string;
  partnerLinked: boolean;
  eventCategories: string[];
  categoryColors: Record<string, string>;
  groceryLists: string[];
  planningDisplayMode: 'daily' | 'monthly_list';
  profileImage?: string;
  p1Points: number;
  p2Points: number;
  chores: Chore[];
  rewards: Reward[];
  achievedRewards: AchievedReward[];
  choreHistory: ChoreHistoryEntry[];
  lastResetDate: string;
  enableDebts: boolean;
  showDebtWarning: boolean;
  notifyPartnerExpense: boolean;
  notifyTaskDue: boolean;
}
