resource "aws_cloudfront_origin_access_identity" "site" {
  comment = "www.fumiweb.net.s3.ap-northeast-1.amazonaws.com"
}

resource "aws_cloudfront_distribution" "site" {
  aliases             = ["fumiweb.net", "www.fumiweb.net"]
  default_root_object = "index.html"
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_200"

  origin {
    domain_name = "${aws_s3_bucket.site.bucket}.s3.ap-northeast-1.amazonaws.com"
    origin_id   = "${aws_s3_bucket.site.bucket}.s3.ap-northeast-1.amazonaws.com"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.site.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = "${aws_s3_bucket.site.bucket}.s3.ap-northeast-1.amazonaws.com"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
    # AWS マネージドポリシー: CachingOptimized
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  # SPA ルーティング: 存在しないパスは index.html を 200 で返す
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.wildcard.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
