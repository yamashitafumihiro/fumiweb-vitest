# いいねカウント (post_id = 記事 slug)
resource "aws_dynamodb_table" "likes" {
  name           = "likes"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "post_id"

  attribute {
    name = "post_id"
    type = "S"
  }
}
