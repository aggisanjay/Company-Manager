import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatUrl(url: string | null | undefined): { display: string; href: string } | null {
  if (!url || !url.trim()) return null;
  const cleanUrl = url.trim();
  const hasProtocol = /^https?:\/\//i.test(cleanUrl);
  const href = hasProtocol ? cleanUrl : `https://${cleanUrl}`;
  const display = cleanUrl.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
  return { display, href };
}
