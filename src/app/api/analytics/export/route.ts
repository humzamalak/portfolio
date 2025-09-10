import { NextRequest, NextResponse } from 'next/server';
import { exportAnalyticsData, getAnalyticsData, generateGapReport } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json';
    const days = parseInt(url.searchParams.get('days') || '30');

    if (format === 'pdf') {
      // Generate PDF report
      const analyticsData = await getAnalyticsData(days);
      const gapReport = await generateGapReport();
      
      // For now, return JSON with PDF structure
      // In production, you would use pdfkit or similar library
      const pdfData = {
        title: 'Portfolio Analytics Report',
        generatedAt: new Date().toISOString(),
        period: `${days} days`,
        summary: {
          totalQueries: analyticsData.totalQueries,
          averageSessionDuration: `${analyticsData.averageSessionDuration.toFixed(1)} minutes`,
          ctaClickRate: `${(analyticsData.ctaClickRate * 100).toFixed(1)}%`
        },
        topProjects: analyticsData.topProjects.map(p => ({
          project: p.title,
          mentions: p.count
        })),
        gapAnalysis: {
          topUnansweredSkills: gapReport.topUnansweredSkills,
          recommendations: gapReport.recommendations,
          lowConfidenceQueries: gapReport.lowConfidenceQueries.slice(0, 5)
        }
      };

      return NextResponse.json(pdfData, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="portfolio-analytics-report.json"'
        }
      });
    } else {
      // Return JSON format
      const data = await exportAnalyticsData(days);
      
      return NextResponse.json(data, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="portfolio-analytics.json"'
        }
      });
    }
  } catch (error) {
    console.error('Analytics export error:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics data' },
      { status: 500 }
    );
  }
}

// POST endpoint for generating custom reports
export async function POST(req: NextRequest) {
  try {
    const { days = 30, includeGapAnalysis = true, format = 'json' } = await req.json();
    
    const analyticsData = await getAnalyticsData(days);
    let gapReport = null;
    
    if (includeGapAnalysis) {
      gapReport = await generateGapReport();
    }
    
    const report = {
      analytics: analyticsData,
      gapReport,
      generatedAt: new Date().toISOString(),
      period: `${days} days`,
      format
    };
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Custom analytics report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate custom report' },
      { status: 500 }
    );
  }
}
