output "cloudfront_distribution_id" {
  description = "デプロイ後のキャッシュ無効化に使用 (GitHub Secrets: CLOUDFRONT_DISTRIBUTION_ID)"
  value       = aws_cloudfront_distribution.site.id
}

output "likes_api_invoke_url" {
  description = "いいね API のベース URL (GitHub Secrets: VITE_API_URL)"
  value       = aws_api_gateway_stage.dev.invoke_url
}

output "site_bucket" {
  description = "静的サイトのデプロイ先バケット"
  value       = aws_s3_bucket.site.bucket
}
