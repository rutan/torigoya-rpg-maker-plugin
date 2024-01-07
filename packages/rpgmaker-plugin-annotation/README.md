# @rutan/rpgmaker-plugin-annotation

> generate plugin annotation from JSON for RPG Maker MV and RPG Maker MZ.

## install

```
$ npm install @rutan/rpgmaker-plugin-annotation
```

## Usage

### CLI

#### Generate annotation file

```
$ rmpab config.json --languages en,ja --defaultLanguage en --out ./result.txt
```

see `test/fixture/sample.json` for an example config.json

### Code

#### sanitize

```typescript
import { sanitize } from '@rutan/rpgmaker-plugin-annotation';

const config = {
  target: ['MZ'],
  title: {
    en: 'SamplePlugin',
    ja: 'サンプルプラグイン',
  },
  // more config ...
};

sanitize(config);
```

#### generateAnnotation

```typescript
import { generateAnnotation } from '@rutan/rpgmaker-plugin-annotation';

const config = {
  target: ['MZ'],
  title: {
    en: 'SamplePlugin',
    ja: 'サンプルプラグイン',
  },
  // more config ...
};

generateAnnotation(config, {
  languages: ['en', 'ja'],
  defaultLanguage: 'en',
});
```

## License

[Unlicense](https://unlicense.org/)
