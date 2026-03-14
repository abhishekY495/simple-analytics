-- name: GetMetrics :one
-- Returns stats for a date range plus the previous period of equal length for comparison.
-- $1 = website_id
-- $2 = current_start, $3 = current_end (exclusive)
-- $4 = prev_start,    $5 = prev_end    (exclusive)
-- The caller computes prev_start/prev_end: e.g. for last 7 days,
--   current = [now-7d, now), prev = [now-14d, now-7d)
SELECT
  -- current period
  (SELECT COUNT(DISTINCT visitor_id)::bigint
   FROM pageviews pv
   WHERE pv.website_id = $1 AND pv.created_at >= $2 AND pv.created_at < $3) AS visitors,
  (SELECT COUNT(*)::bigint
   FROM visits v
   WHERE v.website_id = $1 AND v.started_at >= $2 AND v.started_at < $3) AS visits,
  (SELECT COUNT(*)::bigint
   FROM pageviews pv
   WHERE pv.website_id = $1 AND pv.created_at >= $2 AND pv.created_at < $3) AS views,
  (SELECT COALESCE(
     ROUND(AVG(EXTRACT(EPOCH FROM (ended_at - started_at))))::bigint,
     0
   )
   FROM visits v
   WHERE v.website_id = $1 AND v.started_at >= $2 AND v.started_at < $3) AS avg_visit_duration_seconds,
  -- previous period (for % change comparison)
  (SELECT COUNT(DISTINCT visitor_id)::bigint
   FROM pageviews pv
   WHERE pv.website_id = $1 AND pv.created_at >= $4 AND pv.created_at < $5) AS prev_visitors,
  (SELECT COUNT(*)::bigint
   FROM visits v
   WHERE v.website_id = $1 AND v.started_at >= $4 AND v.started_at < $5) AS prev_visits,
  (SELECT COUNT(*)::bigint
   FROM pageviews pv
   WHERE pv.website_id = $1 AND pv.created_at >= $4 AND pv.created_at < $5) AS prev_views,
  (SELECT COALESCE(
     ROUND(AVG(EXTRACT(EPOCH FROM (ended_at - started_at))))::bigint,
     0
   )
   FROM visits v
   WHERE v.website_id = $1 AND v.started_at >= $4 AND v.started_at < $5) AS prev_avg_visit_duration_seconds;

-- name: GetChartDataByHour :many
-- Returns hourly buckets of visitors and views, including empty buckets (0).
-- Use for: last 24 hours (24 bars), custom range <= 2 days (up to 48 bars).
SELECT
  gs.period_start,
  COALESCE(COUNT(DISTINCT p.visitor_id), 0)::bigint AS visitors,
  COALESCE(COUNT(p.id), 0)::bigint AS views
FROM generate_series($2::timestamptz, $3::timestamptz - interval '1 hour', interval '1 hour') AS gs(period_start)
LEFT JOIN pageviews p
  ON p.website_id = $1
  AND p.created_at >= $2
  AND p.created_at < $3
  AND p.created_at >= gs.period_start
  AND p.created_at < gs.period_start + interval '1 hour'
GROUP BY gs.period_start
ORDER BY gs.period_start ASC;

-- name: GetChartDataByDay :many
-- Returns daily buckets of visitors and views, including empty buckets (0).
-- Use for: last 7 days (7 bars), this week (7 bars), this month (28-31 bars),
--          last 30 days (30 bars), last 90 days (90 bars), custom range > 2 days.
SELECT
  gs.period_start,
  COALESCE(COUNT(DISTINCT p.visitor_id), 0)::bigint AS visitors,
  COALESCE(COUNT(p.id), 0)::bigint AS views
FROM generate_series($2::timestamptz, $3::timestamptz - interval '1 day', interval '1 day') AS gs(period_start)
LEFT JOIN pageviews p
  ON p.website_id = $1
  AND p.created_at >= $2
  AND p.created_at < $3
  AND p.created_at >= gs.period_start
  AND p.created_at < gs.period_start + interval '1 day'
GROUP BY gs.period_start
ORDER BY gs.period_start ASC;

-- name: GetChartDataByMonth :many
-- Returns monthly buckets of visitors and views, including empty buckets (0).
-- Use for: this year (12 bars).
SELECT
  gs.period_start,
  COALESCE(COUNT(DISTINCT p.visitor_id), 0)::bigint AS visitors,
  COALESCE(COUNT(p.id), 0)::bigint AS views
FROM generate_series($2::timestamptz, $3::timestamptz - interval '1 month', interval '1 month') AS gs(period_start)
LEFT JOIN pageviews p
  ON p.website_id = $1
  AND p.created_at >= $2
  AND p.created_at < $3
  AND p.created_at >= gs.period_start
  AND p.created_at < gs.period_start + interval '1 month'
GROUP BY gs.period_start
ORDER BY gs.period_start ASC;
