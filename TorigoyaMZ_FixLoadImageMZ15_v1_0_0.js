/*---------------------------------------------------------------------------*
 * TorigoyaMZ_FixLoadImageMZ15.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2022/09/17 01:19 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc MZ v.1.5 でブラウザプレイ時に画像が表示されない不具合修正パッチ (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_FixLoadImageMZ15.js
 * @help
 * MZ v.1.5 でブラウザプレイ時に画像が表示されない不具合修正パッチ (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * ※このプラグインはRPGツクールMZ 1.5.0で動作確認しています。
 * 　今後のRPGツクールMZのアップデート次第では不要になる可能性があります。
 *
 * ■ なにこれ！
 * RPGツクールMZ v.1.5コアスクリプトの不具合の修正パッチです。
 * ふりーむ！やアツマール、PLiCyなどでブラウザプレイをした際に、
 * 画像が読み込まれないことがある不具合を修正します。
 *
 * ■ 原因
 * RPGツクールMZ 1.4.3 → 1.5.0 の変更に画像読み込み処理の変更が原因です。
 * （Bitmap.prototype._startLoading の処理）
 *
 * この中で画像の読み込み開始時に、もしも画像に既に width （幅）が存在していれば、
 * 画像は既に読み込まれているものと判断して、
 * 読み込み完了後の処理を直ちに実行するような形に変更されています。
 *
 * ですが、実際には画像の width （幅）が存在しているからといって、
 * この時点で画像が描画に利用できるとは限りません。
 * 正しくはブラウザの画像読み込み処理の完了通知を待つ必要があります。
 *
 * この修正パッチプラグインでは、該当の処理を v.1.4.3 コアスクリプトの同等のものに戻し、
 * きちんとブラウザが画像を読み込むのを待ってから処理を実行するようにします。
 */

(function () {
    'use strict';

    (() => {
        Bitmap.prototype._startLoading = function () {
            this._image = new Image();
            this._image.onload = this._onLoad.bind(this);
            this._image.onerror = this._onError.bind(this);
            this._destroyCanvas();
            this._loadingState = 'loading';
            if (Utils.hasEncryptedImages()) {
                this._startDecrypting();
            } else {
                this._image.src = this._url;

                // ↓ v.1.5で追加されたこのあたりが悪い感じ！
                // if (this._image.width > 0) {
                //   this._image.onload = null;
                //   this._onLoad();
                // }
            }
        };
    })();
})();
