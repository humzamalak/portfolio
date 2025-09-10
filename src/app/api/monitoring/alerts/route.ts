import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    let query = supabase
      .from('alerts')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (severity) {
      query = query.eq('severity', severity);
    }
    
    const { data: alerts, error } = await query;
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }
    
    // Calculate summary statistics
    const totalAlerts = alerts?.length || 0;
    const highSeverityAlerts = alerts?.filter(a => a.severity === 'high').length || 0;
    const mediumSeverityAlerts = alerts?.filter(a => a.severity === 'medium').length || 0;
    const lowSeverityAlerts = alerts?.filter(a => a.severity === 'low').length || 0;
    
    // Group alerts by type
    const alertsByType = alerts?.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    return NextResponse.json({
      summary: {
        totalAlerts,
        highSeverityAlerts,
        mediumSeverityAlerts,
        lowSeverityAlerts,
        alertsByType
      },
      alerts,
      period: `${days} days`
    });
    
  } catch (error) {
    console.error('Alerts API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, severity, message, value } = body;
    
    // Store alert
    const { data, error: insertError } = await supabase
      .from('alerts')
      .insert({
        type,
        severity,
        message,
        value,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error storing alert:', insertError);
      return NextResponse.json({ error: 'Failed to store alert' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Alerts API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const alertId = searchParams.get('id');
    
    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }
    
    // Delete alert
    const { error: deleteError } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId);
    
    if (deleteError) {
      console.error('Error deleting alert:', deleteError);
      return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Alerts API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
