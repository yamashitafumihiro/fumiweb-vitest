resource "aws_route53_zone" "main" {
  name = "fumiweb.net"
  # 実環境はコメント無し（プロバイダデフォルトの "Managed by Terraform" を抑止）
  comment = ""
}

resource "aws_route53_record" "apex_a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "fumiweb.net"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.fumiweb.net"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_acm_certificate" "wildcard" {
  provider = aws.us_east_1

  domain_name               = "*.fumiweb.net"
  subject_alternative_names = ["*.fumiweb.net", "fumiweb.net"]
  validation_method         = "DNS"
  key_algorithm             = "RSA_2048"
}

# ACM DNS 検証レコード（発行済み証明書の更新にも使われるため維持）
resource "aws_route53_record" "acm_validation" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_e0412f0321e5077084037d50aaf1f191.fumiweb.net"
  type    = "CNAME"
  ttl     = 300
  records = ["_80c7fcfef4cd44769f74eb50efa62825.sdgjtdhdhz.acm-validations.aws."]
}
