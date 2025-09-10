import { Metadata } from 'next';
import MonitoringDashboard from '@/components/MonitoringDashboard';

export const metadata: Metadata = {
  title: 'AI Assistant Monitoring | Humza Malak',
  description: 'Monitor AI assistant performance, accuracy, and alerts',
  robots: 'noindex, nofollow', // Keep monitoring private
};

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MonitoringDashboard />
    </div>
  );
}
