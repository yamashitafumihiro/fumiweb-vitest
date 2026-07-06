# いいねボタン用 REST API。
# GET / POST は root リソース直下に生えている（子リソースなし）。

resource "aws_api_gateway_rest_api" "likes" {
  name = "/likes"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# --- GET (getLikes) ---

resource "aws_api_gateway_method" "get" {
  rest_api_id   = aws_api_gateway_rest_api.likes.id
  resource_id   = aws_api_gateway_rest_api.likes.root_resource_id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.querystring.post_id" = true
  }
}

resource "aws_api_gateway_integration" "get" {
  rest_api_id             = aws_api_gateway_rest_api.likes.id
  resource_id             = aws_api_gateway_rest_api.likes.root_resource_id
  http_method             = aws_api_gateway_method.get.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.get_likes.invoke_arn
  content_handling        = "CONVERT_TO_TEXT"
  passthrough_behavior    = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "get_200" {
  rest_api_id = aws_api_gateway_rest_api.likes.id
  resource_id = aws_api_gateway_rest_api.likes.root_resource_id
  http_method = aws_api_gateway_method.get.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

# --- POST (incrementLikes) ---

resource "aws_api_gateway_method" "post" {
  rest_api_id   = aws_api_gateway_rest_api.likes.id
  resource_id   = aws_api_gateway_rest_api.likes.root_resource_id
  http_method   = "POST"
  authorization = "NONE"

  request_parameters = {
    "method.request.querystring.action"  = true
    "method.request.querystring.post_id" = true
  }
}

resource "aws_api_gateway_integration" "post" {
  rest_api_id             = aws_api_gateway_rest_api.likes.id
  resource_id             = aws_api_gateway_rest_api.likes.root_resource_id
  http_method             = aws_api_gateway_method.post.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.increment_likes.invoke_arn
  content_handling        = "CONVERT_TO_TEXT"
  passthrough_behavior    = "WHEN_NO_MATCH"
}

resource "aws_api_gateway_method_response" "post_200" {
  rest_api_id = aws_api_gateway_rest_api.likes.id
  resource_id = aws_api_gateway_rest_api.likes.root_resource_id
  http_method = aws_api_gateway_method.post.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

# --- OPTIONS (CORS preflight, MOCK) ---
# NOTE: GET/POST にもコンソールの CORS ウィザードが残した integration response が
# 実在するが、AWS_PROXY 統合には Terraform で作成できないため管理対象外（無害）。

resource "aws_api_gateway_method" "options" {
  rest_api_id   = aws_api_gateway_rest_api.likes.id
  resource_id   = aws_api_gateway_rest_api.likes.root_resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options" {
  rest_api_id          = aws_api_gateway_rest_api.likes.id
  resource_id          = aws_api_gateway_rest_api.likes.root_resource_id
  http_method          = aws_api_gateway_method.options.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id = aws_api_gateway_rest_api.likes.id
  resource_id = aws_api_gateway_rest_api.likes.root_resource_id
  http_method = aws_api_gateway_method.options.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = false
    "method.response.header.Access-Control-Allow-Methods" = false
    "method.response.header.Access-Control-Allow-Origin"  = false
  }
}

resource "aws_api_gateway_integration_response" "options_200" {
  rest_api_id = aws_api_gateway_rest_api.likes.id
  resource_id = aws_api_gateway_rest_api.likes.root_resource_id
  http_method = aws_api_gateway_method.options.http_method
  status_code = aws_api_gateway_method_response.options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# --- Deployment / Stage ---
# NOTE: triggers を設定していないため、メソッド等を変更しても自動では再デプロイされない。
# 変更時は triggers を追加するか、コンソール/CLI で手動デプロイすること（README 参照）。

resource "aws_api_gateway_deployment" "likes" {
  rest_api_id = aws_api_gateway_rest_api.likes.id
}

resource "aws_api_gateway_stage" "dev" {
  rest_api_id   = aws_api_gateway_rest_api.likes.id
  stage_name    = "dev"
  deployment_id = aws_api_gateway_deployment.likes.id
}

resource "aws_api_gateway_method_settings" "all" {
  rest_api_id = aws_api_gateway_rest_api.likes.id
  stage_name  = aws_api_gateway_stage.dev.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled        = true
    logging_level          = "INFO"
    data_trace_enabled     = true
    throttling_burst_limit = 5000
    throttling_rate_limit  = 10000
  }
}

# --- Lambda invoke permissions ---

resource "aws_lambda_permission" "get_likes" {
  statement_id  = "9764273a-963a-54c0-8eab-076f3f882d63"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_likes.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.likes.execution_arn}/*/GET/"
}

# 条件なしの広い permission（コンソール操作の名残）。削除は改善バックログ。
resource "aws_lambda_permission" "get_likes_legacy" {
  statement_id  = "apigateway-invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_likes.function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_lambda_permission" "increment_likes" {
  statement_id  = "c504f314-cc8e-5998-9206-8330b64c13c8"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.increment_likes.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.likes.execution_arn}/*/POST/"
}
