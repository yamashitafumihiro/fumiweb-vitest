# state バケット自体は Terraform 管理外（作成手順は README.md 参照）
terraform {
  backend "s3" {
    bucket       = "fumiweb-terraform-state-010526239036"
    key          = "fumiweb/terraform.tfstate"
    region       = "ap-northeast-1"
    use_lockfile = true
  }
}
