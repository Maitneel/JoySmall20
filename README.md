# JoySmall20
ちょっとしたショートカットやマウス操作をすることを目的に作られた100x95.25mmのキーボードです。

20個のキーとジョイスティック、ロータリーエンコーダを搭載しています。

## Build Guide
必要な部品は以下の通りです

|部品名|個数|遊舎工房さんの商品ページ|秋月電子さんの商品ページ||
|:---|---|---|---|---|
|ProMicro|1|https://shop.yushakobo.jp/products/3905 <br> https://shop.yushakobo.jp/products/pro-micro||いずれか1つで大丈夫です。個人的にはType-Cの方がおすすめです|
|Cherry MX 互換スイッチ|0~20|||つけたい個数用意してください。ProMicroを表側につける場合は最大で18個になります|
|Kailh Switch Socket|スイッチと同じ個数|https://shop.yushakobo.jp/products/a01ps||なくても大丈夫です。MX用を購入してください|
|ダイオード (1N4148)|スイッチと同じ個数|https://shop.yushakobo.jp/products/a0800di-01-100|https://akizukidenshi.com/catalog/g/g100941/||
|ジョイスティック|1||https://akizukidenshi.com/catalog/g/g115951||
|ロータリーエンコーダー|1|https://shop.yushakobo.jp/products/3762|https://akizukidenshi.com/catalog/g/g105772/<br>https://akizukidenshi.com/catalog/g/g105769/<br>https://akizukidenshi.com/catalog/g/g105770/<br>https://akizukidenshi.com/catalog/g/g105771/|EC12と互換性があれば大丈夫だと思います。個人的にはLEDがついてるやつがおすすめです。動作確認は赤・青のLED付きのもので行ってます。1色、フルカラーのLEDが付いてるものがありますが、穴の位置、配線の実装の関係で対応できません|
|LED|0~3|||ロータリーエンコーダでLED付きのものを使用しない場合2つ、ジョイスティックのセンタープッシュを利用しない場合追加で1つのLEDをつけることができます|
|LED用抵抗|LEDと同じ個数|||使用するLEDに合わせて必要な抵抗値を計算してください|
|ジョイスティックセンタープッシュのジャンパー用抵抗|0~1|||あまりに高い抵抗値でなければなんでも大丈夫だと思います。ジャンパーできればいいのでワイヤーでも大丈夫です|
|RESET用タクトスイッチ|1|https://shop.yushakobo.jp/products/a1600ed-01-1|https://akizukidenshi.com/catalog/g/g114890/<br>https://akizukidenshi.com/catalog/g/g114891/||
|コンデンサ|0~2|||ロータリーエンコーダーのノイズ対策につけることができます。プログラムで対応する場合はつけなくて大丈夫です|
|3.5mm TRSジャック|0~1|https://shop.yushakobo.jp/products/a0800tr-01-1|https://akizukidenshi.com/catalog/g/g106070/|通信できたら面白そうだなと思って基板設計ではつけましたが、今のところ対応してないのでただの飾りになる可能性が高いです。|


### 組み立て
撮り忘れたので写真とか動画はないです。正直どの順番でやってもいいのでやりやすい順にやってください。

JoyStickとかRotaryEncoderとかのフットプリントがある方が表で、SW8, SW9から見てJoyStickがある方が上側として説明します。
適時正しく接続ができているか確認してください。

1. ダイオードを半田付けします。フットプリントが四角くなっている方がカソードです。
2. 抵抗を半田付けします。LED1, LED2, LED3に接続する抵抗がそれぞれR1, R2, R3です。LED付きのロータリーエンコーダーを使用する場合R1が基板上部よりのLEDピン、R2が基板Cherryスイッチよりのピンになります。ジョイスティックのセンタープッシュを使用する場合はR4に抵抗(またはワイヤー)を接続してください。
LED3とジョイスティックのセンタープッシュについては同じピンを使用しています。そのため同時に使用することはできませんので、R3とR4を両方とも取り付けることはしないでください。
3. Kailh Switch Socketを取り付ける場合は半田付けする
4. (つける場合は)LED, TRRSジャック, RESET用のタクトスイッチを半田付けする。
-----
ProMicroを裏面につける場合

どちらにつける場合も共通で、一番上のSW3よりのピンがTXO、一番上のJoyStickよりのピンがRAWと接続されるように半田付けします。

5. Kailh Switch Socketを使用しない場合はSW2, SW4を半田付する。(ProMicroを取り付けるのがかなり難しくなるのでSW2, SW4についてはSocketを使うことをおすすめします)
6. ProMicroにピンヘッダを半田付けする。このとき、ProMicroのUSBコネクタがある面からピンヘッダを差し込み、USBコネクタがない面から半田付してください。
7. USBコネクタが上側に来るようにProMicroを基盤に半田付けする。(ピンの位置に注意してください)
2.56mmのピンヘッダを使用し、使用する場合Socketと干渉すると思うので、長めのピンヘッダを使うか、ピンヘッダの絶縁体部分を取り外すか別のピンヘッダの絶縁体部分を用意し、端の部分を2つ重ねて高さを稼ぐなどしてください
------
ProMicroを表面につける場合

どちらにつける場合も共通で、一番上のSW3よりのピンがTXO、一番上のJoyStickよりのピンがRAWと接続されるように半田付けします。

表面に取り付ける場合SW2, SW4は使用できません。

5. ProMicroにピンヘッダを半田付けする。このとき、ProMicroのUSBコネクタのない面からピンヘッダを差し込み、USBコネクタがある面から半田付してください。
6. USBコネクタが上側に来るようにProMicroを基盤に半田付けする。(ピンの位置に注意してください)
----
8. Kailh Switch Socketを使用しない場合はCherry MX 互換スイッチを半田付けする
9. ジョイスティック, ロータリーエンコーダーを取り付ける
10. Kailh Switch Socketを取り付けた場合はスイッチをはめ込む


### ファームウェアを書き込む
今のところ自作のファームウェアしかないので、QMK Firmwareなどをを使って書き込みたい場合はいい感じに作ってください。

まず初めにキーマップを作成します。

1. [Keymap Editor](https://maitneel.github.io/JoySmall20/)でキーマップを編集します。割り当てたいキーの位置をクリックしてから割り当てたいキーをクリックすると割り当てられます。LAYERキーは押している間だけレイヤーの切り替えができます。Layoutはロータリーエンコーダーでキーマップの切り替えができます。
2. `Download define_custom_size.h`, `Download define_custom_keymap.ino`のボタンを押し、設定ファイルをダウンロードします。

キーマップの書き込みをします。Arduino IDEが必要になるので、インストールされていない場合はインストールしてください。

3. [ファームウェアのソースコード](https://github.com/Maitneel/JoySmall20/releases/tag/latest)をダウンロードします。(Releaseから好きなものをダウンロードすることもできますが、バグがある可能性があるのでlatestをダウンロードすることをお勧めします)
4. ダウンロードしたソースコードの`define_custom_size.h`と`define_custom_keymap.ino`に2でダウンロードしたファイルに置き換えます。
5. Arduino IDEで`firmwere_srcs/JoySmall20/JoySmall20.ino`を開き、ProMicroに書き込みます。RESETを2回押すとか連打するとかすると書き込みモードになるはずなのでいろいろ試してみてください。

----

一応これで動くはずです。問題があるようでしたらissue等でご連絡ください！

### 免責
このリポジトリに存在するいずれかまたは全てのものを使用して生じたいかなる損害について、作者はいかなる責任も負いません。
