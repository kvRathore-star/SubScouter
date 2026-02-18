
export interface SubscriptionTemplate {
    name: string;
    domain: string;
    category: string;
    defaultAmount: number;
    color: string;
}

export const SUBSCRIPTION_TEMPLATES: SubscriptionTemplate[] = [
    { name: 'Netflix', domain: 'netflix.com', category: 'Entertainment', defaultAmount: 15.99, color: '#E50914' },
    { name: 'Spotify', domain: 'spotify.com', category: 'Music', defaultAmount: 9.99, color: '#1DB954' },
    { name: 'ChatGPT', domain: 'openai.com', category: 'Software', defaultAmount: 20.00, color: '#10A37F' },
    { name: 'Amazon Prime', domain: 'amazon.com', category: 'Shopping', defaultAmount: 14.99, color: '#FF9900' },
    { name: 'Disney+', domain: 'disneyplus.com', category: 'Entertainment', defaultAmount: 7.99, color: '#006E99' },
    { name: 'Adobe CC', domain: 'adobe.com', category: 'Software', defaultAmount: 52.99, color: '#FF0000' },
    { name: 'Figma', domain: 'figma.com', category: 'Software', defaultAmount: 12.00, color: '#F24E1E' },
    { name: 'Notion', domain: 'notion.so', category: 'Productivity', defaultAmount: 10.00, color: '#000000' },
    { name: 'YouTube Premium', domain: 'youtube.com', category: 'Entertainment', defaultAmount: 13.99, color: '#FF0000' },
    { name: 'GitHub Copilot', domain: 'github.com', category: 'Software', defaultAmount: 10.00, color: '#24292F' },
    { name: 'Slack', domain: 'slack.com', category: 'Business', defaultAmount: 8.00, color: '#4A154B' },
    { name: 'Canva', domain: 'canva.com', category: 'Software', defaultAmount: 12.99, color: '#00C4CC' },
    { name: 'Microsoft 365', domain: 'microsoft.com', category: 'Software', defaultAmount: 6.99, color: '#00A4EF' },
    { name: 'Hulu', domain: 'hulu.com', category: 'Entertainment', defaultAmount: 7.99, color: '#1CE783' },
];
