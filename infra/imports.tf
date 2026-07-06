# 既存リソースの import 定義。import 完了後も no-op なので残している。
# 再構築時の対応表としても機能する。

# --- S3 (静的ホスティング) ---

import {
  to = aws_s3_bucket.site
  id = "www.fumiweb.net"
}

import {
  to = aws_s3_bucket_policy.site
  id = "www.fumiweb.net"
}

import {
  to = aws_s3_bucket_website_configuration.site
  id = "www.fumiweb.net"
}

import {
  to = aws_s3_bucket_public_access_block.site
  id = "www.fumiweb.net"
}

import {
  to = aws_s3_bucket_ownership_controls.site
  id = "www.fumiweb.net"
}

# --- CloudFront ---

import {
  to = aws_cloudfront_origin_access_identity.site
  id = "E1OBDQX9ZRTH8W"
}

import {
  to = aws_cloudfront_distribution.site
  id = "EOD5QPIFPIT3C"
}

# --- ACM / Route53 ---

import {
  provider = aws.us_east_1
  to       = aws_acm_certificate.wildcard
  id       = "arn:aws:acm:us-east-1:010526239036:certificate/7702d245-53ca-4e35-895a-7e795b354575"
}

import {
  to = aws_route53_zone.main
  id = "Z0405503192TG77VU8KXH"
}

import {
  to = aws_route53_record.apex_a
  id = "Z0405503192TG77VU8KXH_fumiweb.net_A"
}

import {
  to = aws_route53_record.www_a
  id = "Z0405503192TG77VU8KXH_www.fumiweb.net_A"
}

import {
  to = aws_route53_record.acm_validation
  id = "Z0405503192TG77VU8KXH__e0412f0321e5077084037d50aaf1f191.fumiweb.net_CNAME"
}

# --- API Gateway (/likes) ---

import {
  to = aws_api_gateway_rest_api.likes
  id = "70rxju4pfb"
}

import {
  to = aws_api_gateway_method.get
  id = "70rxju4pfb/oporm355vd/GET"
}

import {
  to = aws_api_gateway_method.post
  id = "70rxju4pfb/oporm355vd/POST"
}

import {
  to = aws_api_gateway_method.options
  id = "70rxju4pfb/oporm355vd/OPTIONS"
}

import {
  to = aws_api_gateway_integration.get
  id = "70rxju4pfb/oporm355vd/GET"
}

import {
  to = aws_api_gateway_integration.post
  id = "70rxju4pfb/oporm355vd/POST"
}

import {
  to = aws_api_gateway_integration.options
  id = "70rxju4pfb/oporm355vd/OPTIONS"
}

import {
  to = aws_api_gateway_method_response.get_200
  id = "70rxju4pfb/oporm355vd/GET/200"
}

import {
  to = aws_api_gateway_method_response.post_200
  id = "70rxju4pfb/oporm355vd/POST/200"
}

import {
  to = aws_api_gateway_method_response.options_200
  id = "70rxju4pfb/oporm355vd/OPTIONS/200"
}

# GET/POST にもコンソールの CORS ウィザードが残した integration response が存在するが、
# AWS_PROXY 統合には Terraform で作成できないため OPTIONS (MOCK) の分のみ管理する。
import {
  to = aws_api_gateway_integration_response.options_200
  id = "70rxju4pfb/oporm355vd/OPTIONS/200"
}

import {
  to = aws_api_gateway_deployment.likes
  id = "70rxju4pfb/chbvio"
}

import {
  to = aws_api_gateway_stage.dev
  id = "70rxju4pfb/dev"
}

import {
  to = aws_api_gateway_method_settings.all
  id = "70rxju4pfb/dev/*/*"
}

# --- Lambda permissions ---

import {
  to = aws_lambda_permission.get_likes
  id = "getLikes/9764273a-963a-54c0-8eab-076f3f882d63"
}

# 条件なしの広い permission。削除は改善バックログ (README 参照)。
import {
  to = aws_lambda_permission.get_likes_legacy
  id = "getLikes/apigateway-invoke"
}

import {
  to = aws_lambda_permission.increment_likes
  id = "incrementLikes/c504f314-cc8e-5998-9206-8330b64c13c8"
}

# --- Lambda / IAM ---

import {
  to = aws_iam_role.lambda_likes
  id = "LambdaLikesRole"
}

import {
  to = aws_iam_role_policy_attachment.lambda_basic
  id = "LambdaLikesRole/arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

import {
  to = aws_iam_role_policy_attachment.dynamodb_full
  id = "LambdaLikesRole/arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

import {
  to = aws_lambda_function.get_likes
  id = "getLikes"
}

import {
  to = aws_lambda_function.increment_likes
  id = "incrementLikes"
}

# --- DynamoDB ---

import {
  to = aws_dynamodb_table.likes
  id = "likes"
}
