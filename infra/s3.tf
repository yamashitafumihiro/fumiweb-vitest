# 静的サイトホスティング用バケット。
# デプロイ (s3 sync) は .github/workflows/deploy.yml が担当し、オブジェクトは管理しない。

resource "aws_s3_bucket" "site" {
  bucket = "www.fumiweb.net"
}

# CloudFront(OAI) からの GetObject のみ許可
resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = jsonencode({
    Id = "PolicyForCloudFrontPrivateContent"
    Statement = [{
      Action = "s3:GetObject"
      Effect = "Allow"
      Principal = {
        AWS = aws_cloudfront_origin_access_identity.site.iam_arn
      }
      Resource = "${aws_s3_bucket.site.arn}/*"
      Sid      = "1"
    }]
    Version = "2008-10-17"
  })
}

# 現在 CloudFront は REST エンドポイントをオリジンにしており website 設定は未使用だが、
# 現状維持で import している
resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "site" {
  bucket = aws_s3_bucket.site.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}
