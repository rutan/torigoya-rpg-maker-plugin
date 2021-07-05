/*---------------------------------------------------------------------------*
 * TorigoyaMZ_SaveCommand2.js v.2.1.1
 *---------------------------------------------------------------------------*
 * 2021/07/05 22:08 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc セーブコマンド追加プラグイン（オートセーブ） (v.2.1.1)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 2.1.1
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_SaveCommand2.js
 * @help
 * セーブコマンド追加プラグイン（オートセーブ） (v.2.1.1)
 * https://torigoya-plugin.rutan.dev
 *
 * イベントコマンドの「プラグインコマンド」を使って、
 * イベント中に自動的にセーブを実行できるようになります。
 *
 * @command saveWithId
 * @text 【セーブ】スロットIDを指定してセーブ
 * @desc 指定のスロットIDにセーブを実行します。
 * 0は「オートセーブ」用スロットです。
 *
 * @arg slotId
 * @text スロットID
 * @desc セーブするスロットのID
 * @type number
 * @min 0
 * @default 1
 *
 * @arg skipUpdateTimestamp
 * @text セーブ日時の更新をスキップ
 * @desc ロード時のカーソル位置移動防止のため
 * セーブ日時の更新処理をスキップします
 * @type boolean
 * @on スキップする
 * @off スキップしない（標準）
 * @default false
 *
 * @command saveWithVariable
 * @text 【セーブ】変数でスロットIDを指定してセーブ
 * @desc 指定した変数の値のスロットIDにセーブを実行します
 *
 * @arg slotVariableId
 * @text スロットIDが入った変数
 * @desc セーブするスロットのIDを指定する変数
 * @type variable
 *
 * @arg skipUpdateTimestamp
 * @text セーブ日時の更新をスキップ
 * @desc ロード時のカーソル位置移動防止のため
 * セーブ日時の更新処理をスキップします
 * @type boolean
 * @on スキップする
 * @off スキップしない（標準）
 * @default false
 *
 * @command saveLastSlot
 * @text 【セーブ】最後にセーブしたスロットに上書き
 * @desc 最後にセーブしたスロットに上書きセーブします
 *
 * @arg skipUpdateTimestamp
 * @text セーブ日時の更新をスキップ
 * @desc ロード時のカーソル位置移動防止のため
 * セーブ日時の更新処理をスキップします
 * @type boolean
 * @on スキップする
 * @off スキップしない（標準）
 * @default false
 *
 * @command deleteWithId
 * @text 【削除】スロットIDを指定してセーブ削除
 * @desc 【！取り扱い注意！】
 * 指定のスロットIDのセーブデータを削除します
 *
 * @arg slotId
 * @text スロットID
 * @desc セーブを削除するスロットのID
 * @type number
 * @min 0
 * @default 1
 *
 * @command deleteWithVariable
 * @text 【削除】変数でスロットIDを指定してセーブ削除
 * @desc 【！取り扱い注意！】
 * 指定した変数の値のスロットIDのセーブデータを削除します
 *
 * @arg slotVariableId
 * @text スロットIDが入った変数
 * @desc セーブを削除するスロットのIDを指定する変数
 * @type variable
 *
 * @command deleteLastSlot
 * @text 【削除】最後にセーブしたスロットを削除
 * @desc 【！取り扱い注意！】
 * 最後にセーブしたスロットのセーブデータを削除します
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_SaveCommand2';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '2.1.1',
        };
    }

    Torigoya.SaveCommand2 = {
        name: getPluginName(),
        parameter: readParameter(),
        backupLastTimestamp: undefined,
        isBusy: false,
        requestCall: undefined,
    };

    (() => {
        // -------------------------------------------------------------------------
        // Game_Interpreter

        /**
         * セーブの実行リクエスト
         * @param {number} savefileId
         * @param {boolean} skipUpdateTimestamp
         * @returns {Promise<*>}
         */
        Game_Interpreter.prototype.torigoyaSaveCommand_requestSave = function (savefileId, skipUpdateTimestamp) {
            Torigoya.SaveCommand2.requestCall = () => {
                if (skipUpdateTimestamp) {
                    if (DataManager._globalInfo && DataManager._globalInfo[savefileId]) {
                        Torigoya.SaveCommand2.backupLastTimestamp = DataManager._globalInfo[savefileId].timestamp || 0;
                    } else {
                        Torigoya.SaveCommand2.backupLastTimestamp = 0;
                    }
                } else {
                    $gameSystem.setSavefileId(savefileId);
                }

                $gameSystem.onBeforeSave();

                return DataManager.saveGame(savefileId);
            };
        };

        /**
         * セーブデータの削除リクエスト
         * @param {number} savefileId
         * @returns {Promise<*>}
         */
        Game_Interpreter.prototype.torigoyaSaveCommand_requestDelete = function (savefileId) {
            const saveName = DataManager.makeSavename(savefileId);
            Torigoya.SaveCommand2.requestCall = () => {
                return (StorageManager.remove(saveName) || Promise.resolve()).then(() =>
                    DataManager.removeInvalidGlobalInfo()
                );
            };
        };

        Game_Interpreter.prototype.torigoyaSaveCommand_clearState = function () {
            Torigoya.SaveCommand2.isBusy = false;
            Torigoya.SaveCommand2.backupLastTimestamp = undefined;
            Torigoya.SaveCommand2.requestCall = undefined;
        };

        const upstream_Game_Interpreter_updateWait = Game_Interpreter.prototype.updateWait;
        Game_Interpreter.prototype.updateWait = function () {
            if (Torigoya.SaveCommand2.requestCall) {
                const requestCall = Torigoya.SaveCommand2.requestCall;
                requestCall()
                    .then(() => this.torigoyaSaveCommand_clearState())
                    .catch(() => this.torigoyaSaveCommand_clearState());

                Torigoya.SaveCommand2.requestCall = undefined;
                Torigoya.SaveCommand2.isBusy = true;
                return true;
            }
            if (Torigoya.SaveCommand2.isBusy) return true;

            return upstream_Game_Interpreter_updateWait.apply(this);
        };

        // -------------------------------------------------------------------------
        // DataManager

        const upstream_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
        DataManager.makeSavefileInfo = function () {
            const info = upstream_DataManager_makeSavefileInfo.apply(this);

            if (Torigoya.SaveCommand2.backupLastTimestamp !== undefined) {
                info.timestamp = Torigoya.SaveCommand2.backupLastTimestamp;
                Torigoya.SaveCommand2.backupLastTimestamp = undefined;
            }

            return info;
        };

        // -------------------------------------------------------------------------
        // プラグインコマンド

        function commandSaveWithId({ slotId, skipUpdateTimestamp }) {
            slotId = parseInt(slotId, 10);
            skipUpdateTimestamp = skipUpdateTimestamp === 'true';
            this.torigoyaSaveCommand_requestSave(slotId, skipUpdateTimestamp);
        }

        function commandSaveWithVariable({ slotVariableId, skipUpdateTimestamp }) {
            slotVariableId = parseInt(slotVariableId, 10);
            const slotId = $gameVariables.value(slotVariableId);
            skipUpdateTimestamp = skipUpdateTimestamp === 'true';
            this.torigoyaSaveCommand_requestSave(slotId, skipUpdateTimestamp);
        }

        function commandSaveLastSlot({ skipUpdateTimestamp }) {
            const slotId = $gameSystem.savefileId() || DataManager.emptySavefileId();
            skipUpdateTimestamp = skipUpdateTimestamp === 'true';
            this.torigoyaSaveCommand_requestSave(slotId, skipUpdateTimestamp);
        }

        function commandDeleteWithId({ slotId }) {
            slotId = parseInt(slotId, 10);
            this.torigoyaSaveCommand_requestDelete(slotId);
        }

        function commandDeleteWithVariable({ slotVariableId }) {
            slotVariableId = parseInt(slotVariableId, 10);
            const slotId = $gameVariables.value(slotVariableId);
            this.torigoyaSaveCommand_requestDelete(slotId);
        }

        function commandDeleteLastSlot() {
            const slotId = $gameSystem.savefileId() || DataManager.emptySavefileId();
            this.torigoyaSaveCommand_requestDelete(slotId);
        }

        PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'saveWithId', commandSaveWithId);
        PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'saveWithVariable', commandSaveWithVariable);
        PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'saveLastSlot', commandSaveLastSlot);
        PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'deleteWithId', commandDeleteWithId);
        PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'deleteWithVariable', commandDeleteWithVariable);
        PluginManager.registerCommand(Torigoya.SaveCommand2.name, 'deleteLastSlot', commandDeleteLastSlot);
    })();
})();
