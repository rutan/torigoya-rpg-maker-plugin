/*---------------------------------------------------------------------------*
 * TorigoyaMZ_NotifyMessage_AddonGetItem.js v.1.3.0
 *---------------------------------------------------------------------------*
 * Build Date: 2024/06/07 02:10:34 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 通知メッセージアドオン: アイテム獲得表示 (v.1.3.0)
 * @version 1.3.0
 * @author Ruたん（ru_shalm）
 * @license public domain
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_NotifyMessage_AddonGetItem.js
 *
 * @base TorigoyaMZ_NotifyMessage
 * @orderAfter TorigoyaMZ_NotifyMessage
 *
 * @help 通知メッセージアドオン: アイテム獲得表示 (v.1.3.0)
 * https://torigoya-plugin.rutan.dev
 *
 * 以下のイベントコマンド実行時に自動的に通知メッセージを表示します。
 * ※増やす場合のみ表示されます
 *
 * ・所持金の増減
 * ・アイテムの増減
 * ・武器の増減
 * ・防具の増減
 *
 * ------------------------------------------------------------
 * ■ お金の場合は表示したくない場合
 * ------------------------------------------------------------
 * お金の入手メッセージはいらない！という場合は、
 * お金の入手メッセージの内容を空欄にしてください。
 *
 * ------------------------------------------------------------
 * ■ 一部アイテムだけ表示したくない場合
 * ------------------------------------------------------------
 * アイテムのメモ欄に以下のタグを記述することで、
 * 通知メッセージを表示しないようにできます。
 *
 * <獲得通知非表示>
 *
 * または
 *
 * <GainNotifyHidden>
 *
 * ------------------------------------------------------------
 * ■ 一部の場面で表示したくない場合
 * ------------------------------------------------------------
 * 上級者設定の「有効スイッチ」を設定しよう！
 *
 * @param base
 * @text ■ 基本設定
 * @type string
 *
 * @param baseGainSingleMessage
 * @text アイテム入手メッセージ（1つ）
 * @desc アイテムを1つ入手したときのメッセージを設定します。（\name : アイテム名）
 * @parent base
 * @type string
 * @default \c[2]\name\c[0] を手に入れた！
 *
 * @param baseGainMultiMessage
 * @text アイテム入手メッセージ（複数）
 * @desc アイテムを複数入手したときのメッセージを設定します。（\name : アイテム名  \count : 個数）
 * @parent base
 * @type string
 * @default \c[2]\name\c[0] ×\count を手に入れた！
 *
 * @param baseGainMoneyMessage
 * @text お金入手メッセージ
 * @desc お金を入手したときのメッセージを設定します。（\gold : 獲得金額）
 * @parent base
 * @type string
 * @default \gold\c[4]\G\c[0] を手に入れた！
 *
 * @param baseGainMoneyIcon
 * @text お金入手アイコン
 * @desc お金を入手したときのアイコンIDを設定します。0の場合はアイコンを表示しません。
 * @parent base
 * @type number
 * @decimals 0
 * @default 0
 *
 * @param advanced
 * @text ■ 上級者設定
 * @type string
 *
 * @param advancedSwitch
 * @text 有効スイッチ
 * @desc このスイッチがONのときのみ画面に通知するようにします。「なし」の場合は常に通知されます。
 * @parent advanced
 * @type switch
 * @default 0
 *
 * @param advancedShowHiddenItem
 * @text 隠しアイテム表示
 * @desc 「アイテムタイプ：隠しアイテム」の場合に通知を表示するか指定します。
 * @parent advanced
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true
 *
 * @param advancedGainItemSound
 * @text アイテム入手効果音の上書き
 * @desc アイテムを入手したときに再生する効果音を指定します。
 * 上書き設定をしない場合は通常の通知音が再生されます。
 * @parent advanced
 * @type struct<CustomSound>
 * @default {"overwrite":"false","sound":"{\"name\":\"\",\"volume\":\"90\",\"pitch\":\"100\",\"pan\":\"0\"}"}
 *
 * @param advancedGainMoneySound
 * @text お金入手効果音の上書き
 * @desc お金を入手したときに再生する効果音を指定します。
 * 上書き設定をしない場合は通常の通知音が再生されます。
 * @parent advanced
 * @type struct<CustomSound>
 * @default {"overwrite":"false","sound":"{\"name\":\"\",\"volume\":\"90\",\"pitch\":\"100\",\"pan\":\"0\"}"}
 */

/*~struct~CustomSound:
 * @param overwrite
 * @text 効果音設定の上書き
 * @desc 通知表示時に再生する効果音を
 * デフォルトから上書き設定するか指定します。
 * @type boolean
 * @on 上書きする
 * @off 上書きしない
 * @default false
 *
 * @param sound
 * @text 効果音
 * @desc 上書き設定する効果音の内容を指定します。
 * 上書きしない場合、この設定は無視されます。
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 */

/*~struct~Sound:
 * @param name
 * @text 効果音ファイル名
 * @desc 通知表示時に再生する効果音ファイル
 * 空っぽの場合は効果音なしになります
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text 効果音の音量
 * @desc 通知表示時に再生する効果音の音量（%）
 * @type number
 * @min 0
 * @max 100
 * @decimals 0
 * @default 90
 *
 * @param pitch
 * @text 効果音のピッチ
 * @desc 通知表示時に再生する効果音のピッチ（%）
 * @type number
 * @min 0
 * @max 200
 * @decimals 0
 * @default 100
 *
 * @param pan
 * @text 効果音の位相
 * @desc 通知表示時に再生する効果音の位相
 * @type number
 * @min -100
 * @max 100
 * @decimals 0
 * @default 0
 */

(function () {
    'use strict';

    /**
     * プラグインが存在するかチェックする
     * @param pluginObject
     * @param errorMessage
     */
    function checkExistPlugin(pluginObject, errorMessage) {
        if (typeof pluginObject !== 'undefined') return;
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    /**
     * プラグインのファイル名を取得
     */
    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_NotifyMessage_AddonGetItem';
    }

    function parseBooleanParam(value, defaultValue) {
        if (value === undefined) return defaultValue;
        return String(value).toLowerCase() === 'true';
    }
    function parseIntegerParam(value, defaultValue) {
        if (value === undefined || value === '') return defaultValue;
        const intValue = Number.parseInt(String(value), 10);
        return isNaN(intValue) ? defaultValue : intValue;
    }
    function parseStringParam(value, defaultValue) {
        if (value === undefined) return defaultValue;
        return String(value);
    }
    function parseStructObjectParam(value, defaultValue) {
        if (value === undefined || value === '') return defaultValue;
        if (typeof value === 'string') return JSON.parse(value);
        return value;
    }

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function readStructCustomSound(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            overwrite: parseBooleanParam(parameters['overwrite'], false),
            sound: readStructSound(
                parseStructObjectParam(parameters['sound'], { name: '', volume: 90, pitch: 100, pan: 0 }),
            ),
        };
    }

    function readStructSound(parameters) {
        parameters = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
        return {
            name: parseStringParam(parameters['name'], ''),
            volume: parseIntegerParam(parameters['volume'], 90),
            pitch: parseIntegerParam(parameters['pitch'], 100),
            pan: parseIntegerParam(parameters['pan'], 0),
        };
    }

    function readParameter() {
        const parameters = PluginManager.parameters(getPluginName());
        return {
            version: '1.3.0',
            base: parseStringParam(parameters['base'], ''),
            baseGainSingleMessage: parseStringParam(
                parameters['baseGainSingleMessage'],
                '\\c[2]\\name\\c[0] を手に入れた！',
            ),
            baseGainMultiMessage: parseStringParam(
                parameters['baseGainMultiMessage'],
                '\\c[2]\\name\\c[0] ×\\count を手に入れた！',
            ),
            baseGainMoneyMessage: parseStringParam(
                parameters['baseGainMoneyMessage'],
                '\\gold\\c[4]\\G\\c[0] を手に入れた！',
            ),
            baseGainMoneyIcon: parseIntegerParam(parameters['baseGainMoneyIcon'], 0),
            advanced: parseStringParam(parameters['advanced'], ''),
            advancedSwitch: parseIntegerParam(parameters['advancedSwitch'], 0),
            advancedShowHiddenItem: parseBooleanParam(parameters['advancedShowHiddenItem'], true),
            advancedGainItemSound: readStructCustomSound(
                parseStructObjectParam(parameters['advancedGainItemSound'], {
                    overwrite: false,
                    sound: { name: '', volume: 90, pitch: 100, pan: 0 },
                }),
            ),
            advancedGainMoneySound: readStructCustomSound(
                parseStructObjectParam(parameters['advancedGainMoneySound'], {
                    overwrite: false,
                    sound: { name: '', volume: 90, pitch: 100, pan: 0 },
                }),
            ),
        };
    }

    checkExistPlugin(
        Torigoya.NotifyMessage,
        '「通知メッセージアドオン: アイテム獲得表示」より上に「通知メッセージプラグイン」が導入されていません。',
    );

    Torigoya.NotifyMessage.Addons = Torigoya.NotifyMessage.Addons || {};
    Torigoya.NotifyMessage.Addons.GetItem = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // -------------------------------------------------------------------------
        // Functions

        Torigoya.NotifyMessage.Addons.GetItem.isEnabled = function () {
            const switchId = Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedSwitch;
            if (!switchId) return true;

            return $gameSwitches.value(switchId);
        };

        Torigoya.NotifyMessage.Addons.GetItem.isShowHiddenItem = function () {
            return !!Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedShowHiddenItem;
        };

        Torigoya.NotifyMessage.Addons.GetItem.notifyGainMoney = function (value) {
            if (!this.isEnabled()) return;

            const template = Torigoya.NotifyMessage.Addons.GetItem.parameter.baseGainMoneyMessage;
            if (!template) return;

            const notifyItem = new Torigoya.NotifyMessage.NotifyItem({
                message: template.replace(/\\gold/, value),
                icon: Torigoya.NotifyMessage.Addons.GetItem.parameter.baseGainMoneyIcon,
                note: '<type:gainMoney>',
            });
            Torigoya.NotifyMessage.Manager.notify(notifyItem);
        };

        Torigoya.NotifyMessage.Addons.GetItem.notifyGainItem = function (item, count) {
            if (!this.isEnabled()) return;
            if (!this.isNotifyItem(item)) return;

            const template =
                count === 1
                    ? Torigoya.NotifyMessage.Addons.GetItem.parameter.baseGainSingleMessage
                    : Torigoya.NotifyMessage.Addons.GetItem.parameter.baseGainMultiMessage;
            if (!template) return;

            const notifyItem = new Torigoya.NotifyMessage.NotifyItem({
                message: template.replace(/\\count/, count).replace(/\\name/, item.name),
                icon: item.iconIndex,
                note: '<type:gainItem>',
            });
            Torigoya.NotifyMessage.Manager.notify(notifyItem);
        };

        Torigoya.NotifyMessage.Addons.GetItem.isNotifyItem = function (item) {
            if (!this.isShowHiddenItem() && (item.itypeId === 3 || item.itypeId === 4)) return false;
            if (item.meta && (item.meta['GainNotifyHidden'] || item.meta['獲得通知非表示'])) return false;

            return true;
        };

        // -------------------------------------------------------------------------
        // Torigoya.NotifyMessage.NotifyItem

        const upstream_NotifyItem_getDisplaySe = Torigoya.NotifyMessage.NotifyItem.prototype.getDisplaySe;
        Torigoya.NotifyMessage.NotifyItem.prototype.getDisplaySe = function () {
            switch (this.meta.type) {
                case 'gainItem': {
                    if (Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedGainItemSound.overwrite) {
                        return Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedGainItemSound.sound;
                    }
                    break;
                }
                case 'gainMoney': {
                    if (Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedGainMoneySound.overwrite) {
                        return Torigoya.NotifyMessage.Addons.GetItem.parameter.advancedGainMoneySound.sound;
                    }
                    break;
                }
            }
            return upstream_NotifyItem_getDisplaySe.apply(this);
        };

        // -------------------------------------------------------------------------
        // Game_Interpreter

        const upstream_Game_Interpreter_command125 = Game_Interpreter.prototype.command125;
        Game_Interpreter.prototype.command125 = function (params) {
            const value = this.operateValue(params[0], params[1], params[2]);
            if (value > 0) Torigoya.NotifyMessage.Addons.GetItem.notifyGainMoney(value);
            return upstream_Game_Interpreter_command125.apply(this, arguments);
        };

        const upstream_Game_Interpreter_command126 = Game_Interpreter.prototype.command126;
        Game_Interpreter.prototype.command126 = function (params) {
            const value = this.operateValue(params[1], params[2], params[3]);
            if (value > 0) Torigoya.NotifyMessage.Addons.GetItem.notifyGainItem($dataItems[params[0]], value);
            return upstream_Game_Interpreter_command126.apply(this, arguments);
        };

        const upstream_Game_Interpreter_command127 = Game_Interpreter.prototype.command127;
        Game_Interpreter.prototype.command127 = function (params) {
            const value = this.operateValue(params[1], params[2], params[3]);
            if (value > 0) Torigoya.NotifyMessage.Addons.GetItem.notifyGainItem($dataWeapons[params[0]], value);
            return upstream_Game_Interpreter_command127.apply(this, arguments);
        };

        const upstream_Game_Interpreter_command128 = Game_Interpreter.prototype.command128;
        Game_Interpreter.prototype.command128 = function (params) {
            const value = this.operateValue(params[1], params[2], params[3]);
            if (value > 0) Torigoya.NotifyMessage.Addons.GetItem.notifyGainItem($dataArmors[params[0]], value);
            return upstream_Game_Interpreter_command128.apply(this, arguments);
        };
    })();
})();
