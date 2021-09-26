/*---------------------------------------------------------------------------*
 * Torigoya_AtsumaruCommentOpacity.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2021/09/27 02:14 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc アツマールコメント不透明度変更プラグイン (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/Torigoya_AtsumaruCommentOpacity.js
 * @help
 * アツマールコメント不透明度変更プラグイン (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * ※このプラグインはゲームアツマール用の非公式プラグインです
 * ゲームアツマールに表示されるコメントの不透明度を変更します。
 *
 * ------------------------------------------------------------
 * ■ Q&A
 * ------------------------------------------------------------
 * Q. ゲーム中に不透明度を変更できますか？
 * A. プラグインコマンドで変更できます。
 * 　 なお、セーブデータには反映されないため、
 * 　 タイトル画面に戻ったりするともとに戻ります。
 * 　 （イベントシーン的な部分で使うことを想定しているよ）
 *
 * Q. ギフトの不透明度は変わりますか？
 * A. ギフトはゲーム本体とは別のレイヤーにあるため
 * 　 どうやっても変更できません。
 *
 * @param base
 * @text ■ 基本設定
 *
 * @param defaultOpacity
 * @text 不透明度
 * @desc コメントの不透明度を設定します。
 * 0～255で設定してください。0だと完全に透明になります。
 * @type number
 * @parent base
 * @min 0
 * @max 255
 * @default 255
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_AtsumaruCommentOpacity';
    }

    function pickIntegerValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseInt(parameter[key], 10);
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
            defaultOpacity: pickIntegerValueFromParameter(parameter, 'defaultOpacity', 255),
        };
    }

    // アツマールのコメントのcssセレクタ
    const ATSUMARU_COMMENT_SELECTOR = '.comment_box';

    /**
     * コメントの不透明度を設定
     * @param opacity
     */
    function setOpacity(opacity) {
        if (isNaN(opacity)) return;

        const commentBox = document.querySelector(ATSUMARU_COMMENT_SELECTOR);
        if (!commentBox) return;

        commentBox.style.opacity = String(opacity / 255);
    }

    Torigoya.AtsumaruCommentOpacity = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // -------------------------------------------------------------------------
        // Scene_Title

        const upstream_Scene_Title_create = Scene_Title.prototype.create;
        Scene_Title.prototype.create = function () {
            upstream_Scene_Title_create.apply(this);
            this.torigoyaAtsumaruCommentOpacity_setDefaultOpacity();
        };

        Scene_Title.prototype.torigoyaAtsumaruCommentOpacity_setDefaultOpacity = function () {
            setOpacity(Torigoya.AtsumaruCommentOpacity.parameter.defaultOpacity);
        };

        // -------------------------------------------------------------------------
        // プラグインコマンド

        const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            switch (command) {
                case 'SetCommentOpacity':
                case 'コメント不透明度設定':
                    setOpacity(parseInt(args[0], 10));
                    return;
                case 'ResetCommentOpacity':
                case 'コメント不透明度初期化':
                    setOpacity(Torigoya.AtsumaruCommentOpacity.parameter.defaultOpacity);
                    return;
            }

            return upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
        };
    })();
})();
