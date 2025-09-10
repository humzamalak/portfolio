# Analytics System Setup Guide

## Overview

The analytics system tracks recruiter interactions with the AI assistant to generate insights for portfolio optimization. It logs queries, CTA clicks, and session data to identify gaps and improve content.

## Database Setup

### 1. Supabase Configuration

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create queries table for analytics logging
CREATE TABLE queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_text TEXT NOT NULL,
  embedding vector(1536),
  project_ids UUID[],
  cta_clicked TEXT, -- Store which CTA was clicked (e.g., 'portfolio', 'contact', 'demo')
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for vector similarity search
CREATE INDEX ON queries USING ivfflat (embedding vector_cosine_ops);
```

### 2. Environment Variables

Ensure these environment variables are set:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## API Endpoints

### Chat Analytics (`/api/chat`)

Logs queries and CTA clicks from chat interactions:

```typescript
POST /api/chat
{
  "messages": [...],
  "sessionId": "session_1234567890_abc123",
  "ctaClicked": "portfolio" // optional
}
```

### Overview Analytics (`/api/overview`)

Logs overview requests with session tracking:

```typescript
GET /api/overview?sessionId=session_1234567890_abc123&ctaClicked=portfolio
```

### Analytics Export (`/api/analytics/export`)

Export analytics data in JSON or PDF format:

```typescript
// JSON export
GET /api/analytics/export?format=json&days=30

// PDF export (returns structured JSON for now)
GET /api/analytics/export?format=pdf&days=30

// Custom report
POST /api/analytics/export
{
  "days": 30,
  "includeGapAnalysis": true,
  "format": "json"
}
```

## Analytics Features

### 1. Query Logging

- **Query Text**: Original user query
- **Embedding**: Vector representation for similarity analysis
- **Project IDs**: Related projects mentioned
- **CTA Clicked**: Which call-to-action was clicked
- **Session ID**: Anonymous session tracking
- **Timestamp**: When the query was made

### 2. Gap Detection

Identifies queries with <80% confidence and extracts common themes:

```typescript
const gapReport = await generateGapReport();
// Returns:
// - topUnansweredSkills: Most common unanswered topics
// - lowConfidenceQueries: Queries that couldn't be answered well
// - recommendations: Suggested portfolio improvements
```

### 3. Analytics Dashboard Data

```typescript
const analytics = await getAnalyticsData(30); // Last 30 days
// Returns:
// - totalQueries: Total number of queries
// - topProjects: Most mentioned projects
// - averageSessionDuration: Average session length in minutes
// - ctaClickRate: Percentage of queries that resulted in CTA clicks
// - lowConfidenceQueries: Queries with poor confidence scores
```

## Usage Examples

### Frontend Integration

```typescript
// Generate session ID for new user
const sessionId = generateSessionId();

// Track CTA clicks
const handleCTAClick = (ctaType: string) => {
  // Include ctaClicked in API calls
  fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      messages,
      sessionId,
      ctaClicked: ctaType
    })
  });
};
```

### Analytics Monitoring

```typescript
// Get weekly analytics
const weeklyData = await getAnalyticsData(7);

// Generate gap report
const gaps = await generateGapReport();

// Export data
const exportData = await exportAnalyticsData(30);
```

## Privacy & Compliance

- **Session IDs**: Generated anonymously, no personal data stored
- **GDPR/CCPA**: No personal information collected
- **Data Retention**: Configure retention policies in Supabase
- **Anonymization**: All data is anonymized by design

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Query Volume**: Track daily/weekly query counts
2. **Confidence Scores**: Monitor average confidence levels
3. **CTA Conversion**: Track click-through rates
4. **Session Duration**: Monitor engagement levels
5. **Gap Analysis**: Weekly reports on unanswered topics

### Recommended Alerts

- Low confidence queries > 20% of total
- CTA click rate < 5%
- Session duration < 2 minutes average
- New unanswered skill patterns

## Troubleshooting

### Common Issues

1. **Embedding Generation Fails**
   - Check OpenAI API key and quota
   - Verify network connectivity
   - Check API rate limits

2. **Supabase Connection Issues**
   - Verify environment variables
   - Check Supabase project status
   - Ensure proper permissions

3. **Analytics Data Missing**
   - Check if queries table exists
   - Verify logging is enabled in API endpoints
   - Check for JavaScript errors in frontend

### Debug Mode

Enable debug logging:

```typescript
// In analytics.ts
console.log('Analytics debug:', { queryText, projectIds, sessionId, ctaClicked });
```

## Future Enhancements

### Phase 3 Features (Planned)

1. **Metabase Integration**: Visual dashboards
2. **Real-time Analytics**: Live query monitoring
3. **Advanced Gap Detection**: ML-based content recommendations
4. **A/B Testing**: Test different portfolio content
5. **Export Formats**: PDF, CSV, Excel exports
6. **Automated Reports**: Weekly email summaries

### Performance Optimizations

1. **Batch Processing**: Group embedding generation
2. **Caching**: Cache frequent analytics queries
3. **Indexing**: Optimize database queries
4. **Compression**: Reduce storage costs

## Testing

Run the analytics tests:

```bash
npm test analytics.test.ts
```

The test suite covers:
- Session ID generation
- Common term extraction
- Recommendation generation
- Error handling
