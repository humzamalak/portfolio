'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageLatency: number;
  averageAccuracy: number;
  successRate: number;
}

interface AlertSummary {
  totalAlerts: number;
  highSeverityAlerts: number;
  mediumSeverityAlerts: number;
  lowSeverityAlerts: number;
  alertsByType: Record<string, number>;
}

interface MonitoringData {
  testSummary: TestSummary;
  alertSummary: AlertSummary;
  recentAlerts: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    timestamp: string;
  }>;
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      
      // Fetch test results and alerts in parallel
      const [testResponse, alertResponse] = await Promise.all([
        fetch('/api/monitoring/test-results?days=7'),
        fetch('/api/monitoring/alerts?days=7')
      ]);

      if (!testResponse.ok || !alertResponse.ok) {
        throw new Error('Failed to fetch monitoring data');
      }

      const testData = await testResponse.json();
      const alertData = await alertResponse.json();

      setData({
        testSummary: testData.summary,
        alertSummary: alertData.summary,
        recentAlerts: alertData.alerts.slice(0, 5) // Show only recent 5 alerts
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const runManualTest = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/monitoring/run-tests', {
        method: 'POST'
      });
      
      if (response.ok) {
        // Refresh data after running tests
        await fetchMonitoringData();
      } else {
        throw new Error('Failed to run manual tests');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Monitoring Data</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchMonitoringData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-gray-600">No monitoring data available</p>
      </div>
    );
  }

  const { testSummary, alertSummary, recentAlerts } = data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant Monitoring</h1>
        <button
          onClick={runManualTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Manual Tests'}
        </button>
      </div>

      {/* Test Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testSummary.totalTests}</div>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(testSummary.successRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              {testSummary.passedTests} passed, {testSummary.failedTests} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testSummary.averageLatency}ms
            </div>
            <p className="text-xs text-gray-500">
              {testSummary.averageLatency > 5000 ? '⚠️ Above threshold' : '✅ Within threshold'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(testSummary.averageAccuracy * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              {testSummary.averageAccuracy < 0.9 ? '⚠️ Below threshold' : '✅ Above threshold'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertSummary.totalAlerts}</div>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertSummary.highSeverityAlerts}</div>
            <p className="text-xs text-gray-500">Critical issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Medium Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{alertSummary.mediumSeverityAlerts}</div>
            <p className="text-xs text-gray-500">Performance issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{alertSummary.lowSeverityAlerts}</div>
            <p className="text-xs text-gray-500">Minor issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAlerts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent alerts</p>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'high'
                      ? 'bg-red-50 border-red-400'
                      : alert.severity === 'medium'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{alert.type}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(alertSummary.alertsByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {type.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
