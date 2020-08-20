/*---------------------------------------------------------------------------*
 * Torigoya_SaveCommand.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/08/20 16:23 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc セーブコマンド追加プラグイン（オートセーブ） (v.1.0.0)
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @version 1.0.0
 * @help
 * セーブコマンド追加プラグイン（オートセーブ） (v.1.0.0)
 *
 * イベントコマンドの「プラグインコマンド」を使って、
 * イベント中に自動的にセーブを実行できるようになります。
 *
 * 例えばオートセーブのゲームなどが作れるようになります。
 *
 * ------------------------------------------------------------
 * ■ プラグインコマンド（セーブ系）
 * ------------------------------------------------------------
 * ● スロット1にセーブを実行する
 * SaveCommand save 1
 *
 * ※ 1 の部分の数字を変えると別のスロットにセーブされます
 *
 * ● 変数[1]番のスロットにセーブを実行する
 * SaveCommand save [1]
 *
 * ● 前回ロード/セーブしたスロットにセーブを実行する
 * SaveCommand save last
 *
 * ※ ロード/セーブしていない場合はスロット1になります。
 *
 * ＜おまけ＞
 * セーブ時に以下のように末尾に「notime」をつけることで
 * セーブ時刻を更新せずにセーブすることができます。
 *
 * SaveCommand save 1 notime
 *
 * これによってロード画面でカーソル位置をオートセーブした場所ではなく
 * プレイヤーが自分でセーブしたファイルに合わせたままにすることができます。
 *
 * ------------------------------------------------------------
 * ■ プラグインコマンド（ロード系）
 * ------------------------------------------------------------
 * ＜注意＞
 * RPGツクールはイベントの途中で
 * セーブデータがロードされることが想定されていません。
 * そのためイベントのタイミングによっては、
 * ロード後のゲームの動作がおかしくなることがあります。
 *
 * ● スロット1からロードを実行する
 * SaveCommand load 1
 *
 * ● 変数[1]番のスロットからロードを実行する
 * SaveCommand load [1]
 *
 * ● 前回ロード/セーブしたスロットからロードを実行する
 * SaveCommand load last
 *
 * ※ ロード/セーブしていない場合はスロット1になります。
 *
 * ● 一番最後にセーブをしたスロットからロードを実行する
 * SaveCommand load latest
 *
 * ※ last ではなく latest です＞＜；
 *
 * ------------------------------------------------------------
 * ■ プラグインコマンド（削除系）
 * ------------------------------------------------------------
 * ＜注意＞
 * セーブデータを削除するコマンドなので取扱注意ですよ！
 *
 * ● スロット1を削除する
 * SaveCommand remove 1
 *
 * ● 変数[1]番のスロットを削除する
 * SaveCommand remove [1]
 *
 * ● 前回ロード/セーブしたスロットを削除する
 * SaveCommand remove last
 *
 * ※ ロード/セーブしていない場合はスロット1になります。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'Torigoya_SaveCommand';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    Torigoya.SaveCommand = {
        name: getPluginName(),
        parameter: readParameter(),
        lastTimestamp: undefined,
        lastAccessId: undefined,
    };

    function parseSlotId(str) {
        let slotId = 0;
        let matches = str.match(/^\[(\d+)]$/);
        if (matches) {
            slotId = $gameVariables.value(parseInt(matches[1], 10));
        } else if (str.match(/^\d+$/)) {
            slotId = parseInt(str, 10);
        } else {
            switch (str) {
                case 'last':
                    slotId = DataManager.lastAccessedSavefileId();
                    break;
                case 'latest':
                    slotId = DataManager.latestSavefileId();
                    break;
            }
        }

        if (slotId <= 0) {
            throw '[Torigoya_SaveCommand.js] invalid SlotId: ' + slotId;
        }

        return slotId;
    }

    function runCommand(gameInterpreter, type, slotId, skipTimestamp) {
        switch (type) {
            case 'load':
                runCommandLoad(gameInterpreter, slotId);
                break;
            case 'save':
                runCommandSave(gameInterpreter, slotId, skipTimestamp);
                break;
            case 'remove':
                runCommandRemove(gameInterpreter, slotId);
                break;
        }
    }

    function runCommandLoad(gameInterpreter, slotId) {
        if (!DataManager.isThisGameFile(slotId)) return;

        const scene = SceneManager._scene;
        scene.fadeOutAll();
        DataManager.loadGame(slotId);
        gameInterpreter.command115(); // 今のイベントが継続しないように中断コマンドを実行する
        Scene_Load.prototype.reloadMapIfUpdated.apply(scene);
        SceneManager.goto(Scene_Map);
        $gameSystem.onAfterLoad();
    }

    function runCommandSave(gameInterpreter, slotId, skipTimestamp) {
        if (skipTimestamp) {
            const info = DataManager.loadSavefileInfo(slotId);
            Torigoya.SaveCommand.lastTimestamp = info && info.timestamp ? info.timestamp : 0;
            Torigoya.SaveCommand.lastAccessId = DataManager.lastAccessedSavefileId();
        }

        // そのままセーブしてしまうと
        // ロード時にもプラグインコマンドが呼び出されてしまうため
        // 次の行のイベントコマンドから始まるように細工する
        const originalIndex = gameInterpreter._index;
        ++gameInterpreter._index;

        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(slotId) && StorageManager.cleanBackup) {
            StorageManager.cleanBackup(slotId);
        }

        if (skipTimestamp) {
            DataManager._lastAccessedId = Torigoya.SaveCommand.lastAccessId;
            Torigoya.SaveCommand.lastTimestamp = undefined;
            Torigoya.SaveCommand.lastAccessId = undefined;
        }

        // 細工した分を戻す
        gameInterpreter._index = originalIndex;
    }

    function runCommandRemove(_, slotId) {
        StorageManager.remove(slotId);
    }

    (() => {
        const upstream_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
        DataManager.makeSavefileInfo = function () {
            const info = upstream_DataManager_makeSavefileInfo.apply(this);
            if (Torigoya.SaveCommand.lastTimestamp !== undefined) {
                info.timestamp = Torigoya.SaveCommand.lastTimestamp;
            }
            return info;
        };

        const upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            if (command === 'SaveCommand') {
                const type = (args[0] || '').trim();
                const slotId = parseSlotId((args[1] || '').trim());
                const skipTimestamp = args[2] === 'notime';
                runCommand(this, type, slotId, skipTimestamp);
                return;
            }
            upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
        };
    })();
})();
