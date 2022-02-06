/*---------------------------------------------------------------------------*
 * Torigoya_JumpVariableLabel.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2022/02/07 00:55 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MV
 * @plugindesc 変数ラベルジャンププラグイン (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/Torigoya_JumpVariableLabel.js
 * @help
 * 変数ラベルジャンププラグイン (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * イベントコマンドの「ラベルジャンプ」で変数を使用できるようにします。
 *
 * ------------------------------------------------------------
 * ■ 使用方法
 * ------------------------------------------------------------
 * このプラグインを導入すると、
 * 「ラベルジャンプ」で指定するテキスト内に
 * 以下の記法が利用できるようになります。
 *
 * \V[変数ID]
 *
 * ※「文章の表示」で使用できる変数の指定と同じ、Vは小文字でもOKです
 *
 * ▼ 例：「状態_変数の中身」のようなラベルにジャンプしたい場合
 * 状態_\v[1]
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_JumpVariableLabel';
    }

    function readParameter() {
        PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    function replaceVariable(text) {
        return text.replace(/\\(?:v|V)\[(\d+)]/g, (_, variableId) => {
            return $gameVariables.value(Number(variableId));
        });
    }

    Torigoya.JumpVariableLabel = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        const upstream_Game_Interpreter_command119 = Game_Interpreter.prototype.command119;
        Game_Interpreter.prototype.command119 = function () {
            this._params = [...this._params];
            this._params[0] = replaceVariable(this._params[0]);
            return upstream_Game_Interpreter_command119.call(this);
        };
    })();
})();
