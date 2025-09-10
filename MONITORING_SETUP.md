# AI Assistant Monitoring & Alerting System

## Overview

This monitoring system ensures the AI assistant maintains high accuracy and performance through automated testing, alerting, and comprehensive dashboards.

## Features

### 🧪 Golden Test Suite
- **15 recruiter-focused test queries** covering common scenarios
- **Automated accuracy measurement** based on project identification
- **Latency monitoring** with configurable thresholds
- **Retry logic** for flaky tests

### 📊 Monitoring Dashboard
- **Real-time test results** visualization
- **Alert management** with severity levels
- **Performance metrics** tracking
- **Historical data** analysis

### 🚨 Alert System
- **Accuracy alerts** when performance drops below 90%
- **Latency alerts** when response time exceeds 5 seconds
- **Test failure alerts** for individual query failures
- **Supabase-based storage** for alert persistence

### ⏰ Automated Testing
- **Daily cron job** runs at 2 AM UTC
- **Vercel cron integration** for serverless execution
- **Manual test triggers** for on-demand testing
- **Comprehensive reporting** with detailed metrics

## Setup Instructions

### 1. Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create test_results table for monitoring
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_id TEXT NOT NULL,
  query_text TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  latency_ms INTEGER NOT NULL,
  accuracy REAL NOT NULL,
  expected_project_ids TEXT[],
  actual_project_ids TEXT[],
  response_data JSONB,
  error_message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table for monitoring
CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'accuracy', 'latency', 'test_failures'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high'
  message TEXT NOT NULL,
  value REAL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for monitoring tables
CREATE INDEX ON test_results (timestamp);
CREATE INDEX ON test_results (query_id);
CREATE INDEX ON test_results (success);
CREATE INDEX ON alerts (timestamp);
CREATE INDEX ON alerts (severity);
CREATE INDEX ON alerts (type);
```

### 2. Environment Variables

Add these to your `.env.local`:

```bash
# Supabase (already configured)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Optional: Cron job security
CRON_SECRET=your_secure_random_string
```

### 3. Vercel Configuration

The cron job is already configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/monitoring/run-tests",
      "schedule": "0 2 * * *"
    }
  ]
}
```

## Usage

### Running Tests Manually

```bash
# Run golden tests locally
npm run test:golden:local

# Run golden tests against production
npm run test:golden

# Run monitoring unit tests
npm run test:monitoring
```

### API Endpoints

#### Test Results
- `GET /api/monitoring/test-results?days=7&limit=100` - Get test results
- `POST /api/monitoring/test-results` - Store test result

#### Alerts
- `GET /api/monitoring/alerts?days=7&severity=high` - Get alerts
- `POST /api/monitoring/alerts` - Create alert
- `DELETE /api/monitoring/alerts?id=alert_id` - Delete alert

#### Test Execution
- `GET /api/monitoring/run-tests` - Manual test trigger
- `POST /api/monitoring/run-tests` - Cron job endpoint

### Monitoring Dashboard

Access the dashboard at `/monitoring` (requires authentication in production).

## Test Configuration

### Golden Test Queries

The test suite includes 15 recruiter-focused scenarios:

1. **Overview** - General portfolio overview
2. **DevOps Experience** - AWS and DevOps projects
3. **AI Experience** - AI/ML capabilities
4. **Frontend Skills** - Frontend technologies
5. **Security Experience** - DevSecOps and security
6. **Kubernetes Experience** - Container orchestration
7. **Automation Skills** - CI/CD and scripting
8. **Full-stack Capability** - Full-stack development
9. **Portfolio Quality** - Most impressive project
10. **Contact Information** - Contact details
11. **Tech Stack** - Primary technologies
12. **Recent Projects** - Latest work
13. **Infrastructure Experience** - Cloud infrastructure
14. **Scripting Skills** - Automation scripts
15. **Portfolio Demo** - Live demonstrations

### Alert Thresholds

- **Minimum Accuracy**: 90%
- **Maximum Latency**: 5000ms
- **Minimum Response Quality**: 80%

### Test Configuration

- **Timeout**: 30 seconds
- **Retry Attempts**: 3
- **Similarity Threshold**: 80%

## Monitoring Metrics

### Test Results
- Total tests run
- Success rate percentage
- Average latency
- Average accuracy
- Failed test details

### Alerts
- Total alerts generated
- Severity distribution (high/medium/low)
- Alert types breakdown
- Recent alert history

## Troubleshooting

### Common Issues

1. **Tests failing due to API errors**
   - Check Supabase connection
   - Verify environment variables
   - Check API endpoint availability

2. **High latency alerts**
   - Monitor OpenAI API response times
   - Check database query performance
   - Review embedding generation speed

3. **Accuracy below threshold**
   - Review RAG knowledge base
   - Check project embeddings
   - Verify query matching logic

### Debug Commands

```bash
# Check test configuration
cat tests/golden.json | jq '.test_config'

# View recent test results
curl "http://localhost:3000/api/monitoring/test-results?days=1"

# View recent alerts
curl "http://localhost:3000/api/monitoring/alerts?days=1"
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review test results and accuracy trends
2. **Monthly**: Update golden test queries based on new projects
3. **Quarterly**: Review and adjust alert thresholds

### Updating Test Queries

1. Edit `tests/golden.json`
2. Add new test cases with expected project IDs
3. Update test configuration if needed
4. Run tests manually to verify

### Scaling Considerations

- **Database**: Monitor query performance as test history grows
- **Storage**: Consider archiving old test results
- **API Limits**: Monitor OpenAI API usage during testing
- **Cron Jobs**: Ensure Vercel cron limits are sufficient

## Security

- **Cron Secret**: Use `CRON_SECRET` for production deployments
- **Access Control**: Restrict monitoring dashboard access
- **Data Privacy**: Ensure test data doesn't contain sensitive information
- **API Security**: Implement rate limiting for monitoring endpoints

## Performance Impact

- **Test Execution**: ~2-3 minutes for full test suite
- **Database Storage**: ~1KB per test result
- **API Calls**: 15 OpenAI API calls per test run
- **Cron Frequency**: Daily execution (configurable)

## Future Enhancements

- **Slack Integration**: Send alerts to Slack channels
- **Email Notifications**: Email alerts for critical issues
- **Advanced Analytics**: Trend analysis and predictions
- **A/B Testing**: Compare different model versions
- **Custom Metrics**: Add business-specific KPIs
