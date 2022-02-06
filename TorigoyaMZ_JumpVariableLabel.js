/*---------------------------------------------------------------------------*
 * TorigoyaMZ_JumpVariableLabel.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2022/02/07 00:55 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 変数ラベルジャンププラグイン (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_JumpVariableLabel.js
 * @orderAfter PluginCommonBase
 * @orderAfter TextScriptBase
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
 *
 * ------------------------------------------------------------
 * ■ オプション機能：PluginCommonBase連携
 * ------------------------------------------------------------
 * 公式プラグインの「PluginCommonBase」や
 * 「TextScriptBase」が入っている場合、
 * それぞれの対応する記法も使用できるようになります。
 *
 * ▼ PluginCommonBase
 * \s[スイッチID]
 * \ss[セルフスイッチID]
 *
 * ▼ TextScriptBase
 * \tx[登録テキストの識別子]
 * \js[登録スクリプトの識別子]
 * \js<スクリプト>
 *
 * 各記法の詳細は、それぞれのプラグインの説明をご確認ください。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_JumpVariableLabel';
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
        function replace(text) {
            if (window.PluginManagerEx) {
                return window.PluginManagerEx.convertEscapeCharacters(text);
            }
            return replaceVariable(text);
        }

        const upstream_Game_Interpreter_command119 = Game_Interpreter.prototype.command119;
        Game_Interpreter.prototype.command119 = function () {
            return upstream_Game_Interpreter_command119.call(this, [replace(params[0])]);
        };
    })();
})();
