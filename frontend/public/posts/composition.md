## 導入

&emsp;一応勉強を目的として開設したこのwebサイトの技術構成について書こうと思います。
自分でもどんな構成にしたか忘れないうちに書かねばという思いです。

## 構成

<img src="../images/composition.png" alt="Composition" style="max-width: 100%; height: auto;">

&emsp;非常に簡単でシンプルな構成しています。理由は私が初心者だからです。
画像の詳細部分を補足すると、buildした静的webページをS3にdeployするという工程をgithub actionsに委託しています。
mainブランチへのpushがトリガーとなっていて、私はただコンポーネントのアップデートやこういった記事をmdで書くことを担当しています。
[ここ](https://github.com/yamashitafumihiro/fumiweb-vitest/tree/main/.github/workflows)にgithub
actionsへ委託している内容を公開しています。

## コンポーネント

&emsp;アルバイトで使い慣れていたReact(ts)を使うことにしました。
UIはMUIにお世話になっています。
こういった記事ですがmdファイルを作成していて、react-markdownというライブラリでhtmlにレンダリングしています。
ちょっとだけ手を加えた点として、mdの見出しレベルから目次を自動生成するようにしています。

## 検討中のアップデート

&emsp;現在は記事のメタデータをJSON形式のデータベースを作って管理していますが、それをAWSのDynamoDBやDocumentDBに移行したいなと思ってます。
後は、差分だけデプロイできないかなと思ってます。
とても軽量なアプリケーションなので差分デプロイする必要性はとても低いですが、出来たほうが自己満足度が高いことと、ちょっとかっこいいので取り組みたいです。
