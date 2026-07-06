# infra

fumiweb (www.fumiweb.net) の AWS インフラを Terraform で管理する。
既存リソースを `imports.tf` の import ブロックで取り込み済み（2026-07 時点で `terraform plan` は "No changes."）。

## 構成

| ファイル | 内容 |
|---|---|
| `s3.tf` | ホスティング用バケット `www.fumiweb.net`（policy / website / PAB / ownership） |
| `cloudfront.tf` | ディストリビューション `EOD5QPIFPIT3C` + OAI |
| `dns.tf` | Route53 ゾーン `fumiweb.net`、A エイリアス ×2、ACM ワイルドカード証明書（us-east-1）+ 検証 CNAME |
| `api_gateway.tf` | REST API `/likes`（GET/POST/OPTIONS、dev ステージ）+ Lambda permission |
| `lambda.tf` | `getLikes` / `incrementLikes` + IAM ロール |
| `dynamodb.tf` | `likes` テーブル（key: `post_id` = 記事 slug） |
| `imports.tf` | import 対応表（no-op なので残置） |

## state

S3 バックエンド + S3 ネイティブロック（DynamoDB ロックテーブル不要）。
state バケット `fumiweb-terraform-state-010526239036` は Terraform 管理外。再作成手順:

```sh
aws s3api create-bucket --bucket fumiweb-terraform-state-010526239036 \
  --region ap-northeast-1 --create-bucket-configuration LocationConstraint=ap-northeast-1
aws s3api put-bucket-versioning --bucket fumiweb-terraform-state-010526239036 \
  --versioning-configuration Status=Enabled
aws s3api put-public-access-block --bucket fumiweb-terraform-state-010526239036 \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

## 運用メモ

- **サイトのデプロイはここではやらない**: `.github/workflows/deploy.yml`（main への push で S3 sync + CloudFront invalidation）が担当。
- **Lambda コードは Terraform 管理外**: デプロイ済み zip の Go バイナリ (`main`) はリポジトリに無いため、
  `lifecycle.ignore_changes = [filename, source_code_hash]` で設定のみ管理している。
  コード更新は従来どおり `GOOS=linux go build` した zip を `aws lambda update-function-code` で。
- **API Gateway の再デプロイ**: deployment に `triggers` を付けていないため、
  メソッド/統合を Terraform で変更しても **自動では反映されない**。変更した場合は
  `aws apigateway create-deployment --rest-api-id 70rxju4pfb --stage-name dev`
  を実行するか、`aws_api_gateway_deployment.likes` に `triggers` を追加すること。
- GET/POST メソッドに実在する integration response（コンソールの CORS ウィザードの残骸）は
  AWS_PROXY 統合には Terraform で作成できないため管理対象外（無害）。

## DynamoDB likes キー移行 (2026-07)

いいねのキーを記事の数値 id から slug へ移行済み（`initPost` / `composition` / `createLikesButton`）。
**新フロントの本番デプロイを確認したら**、旧キーを削除する:

```sh
aws dynamodb delete-item --table-name likes --region ap-northeast-1 --key '{"post_id":{"S":"1"}}'
aws dynamodb delete-item --table-name likes --region ap-northeast-1 --key '{"post_id":{"S":"2"}}'
aws dynamodb delete-item --table-name likes --region ap-northeast-1 --key '{"post_id":{"S":"3"}}'
```

## 削除候補（Terraform 管理外の遺物・要本人確認）

どこからも参照されていないことを確認済み。削除する場合のコマンド付き。

| リソース | 削除コマンド |
|---|---|
| Lambda `LikesHandler` (us-east-1, 旧 Node 版) | `aws lambda delete-function --function-name LikesHandler --region us-east-1` |
| Lambda `ogp-response` (us-east-1, CloudFront 未接続) | `aws lambda delete-function --function-name ogp-response --region us-east-1` |
| IAM ロール `dynamicOgpCreation` (ogp-response 用) | `aws iam delete-role --role-name dynamicOgpCreation`（先にアタッチ済みポリシーの解除が必要） |
| DynamoDB `Likes` (us-east-1, 旧テーブル) | `aws dynamodb delete-table --table-name Likes --region us-east-1` |
| CloudFront `EWOMBRBLT5HJD` (無効化済み) | 無効化済みなので `aws cloudfront delete-distribution --id EWOMBRBLT5HJD --if-match <ETag>` |
| S3 `fumiweb-lambda` (空) | `aws s3api delete-bucket --bucket fumiweb-lambda` |
| API GW の古い deployment 11 件（現役は `chbvio`） | `aws apigateway delete-deployment --rest-api-id 70rxju4pfb --deployment-id <id>` |

## 改善バックログ（現状維持 import のため未実施）

- OAI → OAC（Origin Access Control）への移行
- `AmazonDynamoDBFullAccess` を likes テーブル限定の最小権限ポリシーへ
- `getLikes` の条件なし permission (`apigateway-invoke`) の削除
- Go バイナリを CI でビルドして Lambda デプロイまで自動化
- REST API stage 名が `dev`（実質 prod）である点の整理
