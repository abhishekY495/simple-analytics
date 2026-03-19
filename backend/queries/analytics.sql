-- name: GetStats :one
WITH current_period_visits AS (
    SELECT 
        COUNT(DISTINCT v.visitor_id)::bigint AS total_visitors,
        COUNT(v.id)::bigint AS total_visits,
        COALESCE(AVG(EXTRACT(EPOCH FROM (v.ended_at - v.started_at))), 0)::integer AS avg_visit_duration
    FROM visits v
    WHERE v.website_id = $1 
      AND v.started_at >= $2 AND v.started_at <= $3
),
current_period_views AS (
    SELECT COUNT(p.id)::bigint AS total_views
    FROM pageviews p
    WHERE p.website_id = $1 
      AND p.created_at >= $2 AND p.created_at <= $3
),
prev_period_visits AS (
    SELECT 
        COUNT(DISTINCT v.visitor_id)::bigint AS total_visitors,
        COUNT(v.id)::bigint AS total_visits,
        COALESCE(AVG(EXTRACT(EPOCH FROM (v.ended_at - v.started_at))), 0)::integer AS avg_visit_duration
    FROM visits v
    WHERE v.website_id = $1 
      AND v.started_at >= $4 AND v.started_at <= $5
),
prev_period_views AS (
    SELECT COUNT(p.id)::bigint AS total_views
    FROM pageviews p
    WHERE p.website_id = $1 
      AND p.created_at >= $4 AND p.created_at <= $5
)
SELECT 
    cvs.total_visitors AS "TotalVisitors",
    cvs.total_visits AS "TotalVisits",
    cvw.total_views AS "TotalViews",
    cvs.avg_visit_duration AS "AvgVisitDuration",
    pvs.total_visitors AS "PrevTotalVisitors",
    pvs.total_visits AS "PrevTotalVisits",
    pvw.total_views AS "PrevTotalViews",
    pvs.avg_visit_duration AS "PrevAvgVisitDuration"
FROM 
    current_period_visits cvs, 
    current_period_views cvw, 
    prev_period_visits pvs, 
    prev_period_views pvw;

-- name: GetChartDataByHour :many
SELECT
  gs.period_start AS time,
  COUNT(p.id)::bigint AS views,
  COUNT(DISTINCT p.visitor_id)::bigint AS visitors
FROM generate_series(
  $2::timestamptz,
  $3::timestamptz,
  interval '1 hour'
) AS gs(period_start)
LEFT JOIN pageviews p
  ON p.website_id = $1
  AND p.created_at >= gs.period_start
  AND p.created_at <  gs.period_start + interval '1 hour'
  AND p.created_at >= $2::timestamptz
  AND p.created_at <= $3::timestamptz
GROUP BY gs.period_start
ORDER BY gs.period_start;

-- name: GetChartDataByDay :many
SELECT
  gs.period_start AS time,
  COUNT(p.id)::bigint AS views,
  COUNT(DISTINCT p.visitor_id)::bigint AS visitors
FROM generate_series(
  $2::timestamptz,
  $3::timestamptz,
  interval '1 day'
) AS gs(period_start)
LEFT JOIN pageviews p
  ON p.website_id = $1
  AND p.created_at >= gs.period_start
  AND p.created_at <  gs.period_start + interval '1 day'
  AND p.created_at >= $2::timestamptz
  AND p.created_at <= $3::timestamptz
GROUP BY gs.period_start
ORDER BY gs.period_start;

-- name: GetChartDataByMonth :many
SELECT
  gs.period_start AS time,
  COUNT(p.id)::bigint AS views,
  COUNT(DISTINCT p.visitor_id)::bigint AS visitors
FROM generate_series(
  $2::timestamptz,
  $3::timestamptz,
  interval '1 month'
) AS gs(period_start)
LEFT JOIN pageviews p
  ON p.website_id = $1
  AND p.created_at >= gs.period_start
  AND p.created_at <  gs.period_start + interval '1 month'
  AND p.created_at >= $2::timestamptz
  AND p.created_at <= $3::timestamptz
GROUP BY gs.period_start
ORDER BY gs.period_start;

-- name: GetPageVisitors :many
SELECT
  path,
  COUNT(DISTINCT visitor_id)::bigint AS visitors
FROM pageviews
WHERE website_id = $1 
  AND created_at >= $2 
  AND created_at <= $3
GROUP BY path
ORDER BY visitors DESC
LIMIT $4;

-- name: GetReferrerVisitors :many
SELECT
  referrer,
  COUNT(DISTINCT visitor_id)::bigint AS visitors
FROM pageviews
WHERE website_id = $1 
  AND created_at >= $2 
  AND created_at <= $3
GROUP BY referrer
ORDER BY visitors DESC
LIMIT $4;

-- name: GetCountryVisitors :many
SELECT
  country,
  COUNT(DISTINCT visitor_id)::bigint AS visitors
FROM pageviews
WHERE website_id = $1 
  AND created_at >= $2 
  AND created_at <= $3
GROUP BY country
ORDER BY visitors DESC
LIMIT $4;

-- name: GetBrowserVisitors :many
SELECT
  browser,
  COUNT(DISTINCT visitor_id)::bigint AS visitors
FROM pageviews
WHERE website_id = $1 
  AND created_at >= $2 
  AND created_at <= $3
GROUP BY browser
ORDER BY visitors DESC
LIMIT $4;

-- name: GetOsVisitors :many
SELECT
  os,
  COUNT(DISTINCT visitor_id)::bigint AS visitors
FROM pageviews
WHERE website_id = $1 
  AND created_at >= $2 
  AND created_at <= $3
GROUP BY os
ORDER BY visitors DESC
LIMIT $4;

-- name: GetDeviceTypeVisitors :many
SELECT
  device_type,
  COUNT(DISTINCT visitor_id)::bigint AS visitors
FROM pageviews
WHERE website_id = $1 
  AND created_at >= $2 
  AND created_at <= $3
GROUP BY device_type
ORDER BY visitors DESC
LIMIT $4;