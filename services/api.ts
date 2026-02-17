import { Subscription } from '../types';

export const api = {
  getSubscriptions: async (userId?: string): Promise<Subscription[]> => {
    if (!userId) {
      const data = localStorage.getItem('subtrack_subscriptions');
      return data ? JSON.parse(data) : [];
    }
    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'get' })
      });
      const data = await response.json();
      return data.subscriptions || [];
    } catch (e) {
      console.error('Failed to fetch from sheets', e);
      return [];
    }
  },

  saveSubscriptions: async (subs: Subscription[], userId?: string): Promise<void> => {
    if (!userId) {
      localStorage.setItem('subtrack_subscriptions', JSON.stringify(subs));
      return;
    }
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'save', data: subs })
      });
    } catch (e) {
      console.error('Failed to save to sheets', e);
    }
  },


  exportData: async (userId?: string): Promise<string> => {
    const subs = await api.getSubscriptions(userId);
    const emails = localStorage.getItem('subscout_emails');
    const theme = localStorage.getItem('subscout_theme');

    const vault = {
      subscriptions: subs,
      emails: emails ? JSON.parse(emails) : [],
      theme: theme || 'light',
      version: '1.0',
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(vault, null, 2);
  },

  importData: async (jsonData: string, userId?: string): Promise<boolean> => {
    try {
      const vault = JSON.parse(jsonData);
      if (vault.subscriptions) {
        if (userId) {
          await api.saveSubscriptions(vault.subscriptions, userId);
        } else {
          localStorage.setItem('subtrack_subscriptions', JSON.stringify(vault.subscriptions));
        }
      }
      if (vault.emails) localStorage.setItem('subscout_emails', JSON.stringify(vault.emails));
      if (vault.theme) localStorage.setItem('subscout_theme', vault.theme);
      return true;
    } catch (e) {
      console.error('Import Error:', e);
      return false;
    }
  }
};
