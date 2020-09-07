export class TalkBuilder {
  build(item, options) {
    let message = item.message;
    message = this._replaceMessageReturn(message, item, options);
    message = this._replaceMessageTarget(message, item, options);
    message = this._replaceMessageFrom(message, item, options);
    message = this._replaceMessageSkill(message, item, options);
    return message;
  }

  _replaceMessageReturn(message, item, options) {
    return message.replace(/\\n/g, '\n');
  }

  _replaceMessageTarget(message, item, options) {
    return message.replace(/\\target/g, () => {
      if (!options.targets || options.targets.length === 0) return '';

      if (item.actorId || item.enemyId) {
        for (const target of options.targets) {
          if (target.isEnemy() && target.enemyId() === item.enemyId) {
            return target.name();
          } else if (target.actorId() === item.actorId) {
            return target.name();
          }
        }
      }

      return options.targets[0].name();
    });
  }

  _replaceMessageFrom(message, item, options) {
    return message.replace(/\\(from)/g, () => {
      return options.from ? options.from.name() : '';
    });
  }

  _replaceMessageSkill(message, item, options) {
    return message.replace(/\\(skill|item)/g, () => {
      return options.usingItem ? options.usingItem.name : '';
    });
  }
}
