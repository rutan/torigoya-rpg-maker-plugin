---
name: 'plugin'
root: 'plugins'
output: '.'
ignore: []
questions:
  pluginName: 'Please enter Plugin Name (ex. achievement)'
  isLegacy:
    confirm: 'Is this plugin is legacy style?'
    initial: false
---

# `{{ inputs.pluginName | kebab }}/.gitignore`

```.gitignore
/.turbo
/src/_build
```

# `{{ inputs.pluginName | kebab }}/package.json`

```json
{
  "name": "@rutan/torigoya-plugin-{{ inputs.pluginName | kebab }}",
  "version": "0.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "cross-env NODE_ENV=production rollup -c",
    "watch": "rollup -c -w",
    "clean": "rimraf ./_dist && rimraf ./src/_build"
  },
  "dependencies": {
    "@rutan/torigoya-plugin-common": "workspace:*",
    "@rutan/torigoya-plugin-config": "workspace:*"
  },
  "volta": {
    "extends": "../../package.json"
  }
}
```

# `{{ inputs.pluginName | kebab }}/rollup.config.js`

```javascript
import { defineRollupConfig } from '@rutan/torigoya-plugin-config';

export default defineRollupConfig({
  inputDir: './src',
  outputDir: '../../_dist',
  config: {{ if inputs.isLegacy }}'./config.yaml'{{ else }}'./config.ts'{{ end }},
  build: './src/_build',
  template: '../template.ejs',
});
```

# `{{ inputs.isLegacy || "!" }}{{ inputs.pluginName | kebab }}/config.yaml`

```yaml
base: &base
  version: '0.0.0'
  title:
    en: 'PluginName'
    ja: 'プラグイン名'
  help:
    en: |
      Plugin Description
    ja: |
      プラグインの説明
  params: []
  structs: []

Torigoya_{{ inputs.pluginName | pascal }}:
  <<: *base
  target:
    - 'MV'

TorigoyaMZ_{{ inputs.pluginName | pascal }}:
  <<: *base
  target:
    - 'MZ'
```

# `{{ !inputs.isLegacy || "!" }}{{ inputs.pluginName | kebab }}/config.ts`

```typescript
// TODO: write config
```

# `{{ inputs.pluginName | kebab }}/src/Torigoya_{{ inputs.pluginName | pascal }}.js`

```javascript
import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/Torigoya_{{ inputs.pluginName | pascal }}_parameter';

Torigoya.{{ inputs.pluginName | pascal }} = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // write plugin code
})();
```

# `{{ inputs.pluginName | kebab }}/src/TorigoyaMZ_{{ inputs.pluginName | pascal }}.js`

```javascript
import { Torigoya, getPluginName } from '@rutan/torigoya-plugin-common';
import { readParameter } from './_build/TorigoyaMZ_{{ inputs.pluginName | pascal }}_parameter';

Torigoya.{{ inputs.pluginName | pascal }} = {
  name: getPluginName(),
  parameter: readParameter(),
};

(() => {
  // write plugin code
})();
```
