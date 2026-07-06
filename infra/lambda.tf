# Lambda のコード本体は Terraform 管理外。
# デプロイ済み zip にはコンパイル済みの Go バイナリ (main) が含まれるがリポジトリには無く、
# Terraform からは再現できないため、設定のみ管理しコードは
# `aws lambda update-function-code` で更新する運用を維持する（README 参照）。
# filename はプロバイダの必須制約を満たすためのスタブで、ignore_changes により適用されない。

data "archive_file" "lambda_stub" {
  type        = "zip"
  source_file = "${path.module}/../backend/bootstrap"
  output_path = "${path.module}/.build/lambda_stub.zip"
}

resource "aws_iam_role" "lambda_likes" {
  name = "LambdaLikesRole"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_likes.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# FullAccess は過剰（likes テーブル限定への絞り込みは改善バックログ）
resource "aws_iam_role_policy_attachment" "dynamodb_full" {
  role       = aws_iam_role.lambda_likes.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_lambda_function" "get_likes" {
  function_name = "getLikes"
  role          = aws_iam_role.lambda_likes.arn
  runtime       = "provided.al2023"
  handler       = "bootstrap"
  architectures = ["x86_64"]
  memory_size   = 128
  timeout       = 3

  filename = data.archive_file.lambda_stub.output_path

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_function" "increment_likes" {
  function_name = "incrementLikes"
  role          = aws_iam_role.lambda_likes.arn
  runtime       = "provided.al2023"
  handler       = "bootstrap"
  architectures = ["x86_64"]
  memory_size   = 128
  timeout       = 3

  filename = data.archive_file.lambda_stub.output_path

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}
