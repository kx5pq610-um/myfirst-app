# 人体アトラス 3D（日本語版）

[ashemag/human-atlas](https://github.com/ashemag/human-atlas) をこのプロジェクトで使えるように取り込み、画面の操作・説明・主要な構造名を日本語化した版です。React・Three.js・shadcn/uiで動作し、BodyParts3Dの成人男性モデルを3Dで観察できます。

## できること

- 人体をドラッグで回転、ピンチやスクロールで拡大縮小
- 中学校で学ぶ体表・骨格・筋肉・循環器・呼吸器・消化器・泌尿器・神経／感覚器を切り替え
- 3Dモデル上の構造をクリックして選択
- 選んだ構造だけを表示して周囲の人体と見比べる
- 日本語・英語で構造を検索
- 心臓、脳、肺、腎臓、目、耳、神経などの中学生向け説明を表示
- Chromebookやスマートフォンでも操作できるレスポンシブUI

医学系の細かい分類や展開表示は、授業で迷わないよう画面から省いています。元データの3Dパーツと詳細な検索情報は保持しているため、必要になった場合も拡張できます。

## この場所で起動する

Node.js 22.13以上が必要です。依存関係をインストールしてから、次を実行します。

```sh
pnpm install
pnpm run dev
```

ブラウザで http://localhost:3016 を開いてください。静的ファイルとして公開する場合は、次を実行して `dist/` をGitHub Pagesなどに配置します。

```sh
pnpm run build
```

このフォルダは既存の `outputs/anatomy-atlas/` と分離しているため、これまでの試作品を壊しません。

## 日本語化について

選択名・マウスを重ねたときの名前・検索結果はすべて日本語で表示します。英語の元データはIDや英語検索のために保持し、3,432種類の構造名を `app/anatomy-names-ja.json` に収録しています。BodyParts3Dの公式日本語名称表を基に、左右・部位・血管の枝などの細かな構造を日本語で組み立てています。主要器官には中学校で使う表記を優先し、詳細パネルでは難しい語の意味も補足します。

辞書の再生成: `python scripts/build-japanese-names.py isa_parts_list.txt partof_parts_list.txt`（公式の最新版名称表をダウンロードして指定）。未翻訳の英単語が残ると生成を中止します。確認: `node scripts/check-japanese-names.mjs`。

## 解剖学データとライセンス

このビューアのコードは元リポジトリのMITライセンスに従います。人体形状データは **BodyParts3D 4.0（成人男性の参照モデル、CC BY 4.0）** で、コードとは別のライセンスです。再配布時は帰属表示を残してください。詳しい出典・帰属表示は [public/ATTRIBUTION.md](public/ATTRIBUTION.md) にあります。

モデルは教育用に簡略化されており、すべての人の体や個人差を表すものではありません。診断や手術のための資料ではありません。

## 元リポジトリ

- [Human Atlas - GitHub](https://github.com/ashemag/human-atlas)
- [BodyParts3D](https://lifesciencedb.jp/bp3d/)
