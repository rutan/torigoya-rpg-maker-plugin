const defaultConfig = {
    author: {
        en: 'Rutan(ru_shalm)',
        ja: 'Ruたん（ru_shalm）'
    },
    license: 'public domain'
};

function generateHeader(config) {
    const locales = Object.keys(config.title);

    // descriptions
    const descriptions = locales.map((lang, i) => {
        const lines = [];

        // info
        lines.push(`@plugindesc ${config.title[lang]}${config.version ? ` (v.${config.version})` : ''}`);
        lines.push(`@author ${(config.author || defaultConfig.author)[lang]}`);
        lines.push(`@license ${config.license || defaultConfig.license}`);
        if (config.version) lines.push(`@version ${config.version}`);
        lines.push('@help');
        config.body[lang].trim().split(/\r?\n/).forEach((l) => lines.push(l));

        if (config.parameter && config.parameter.length > 0) {
            lines.push('');
            lines.push(generateProperties(config.parameter, lang));
        }

        return `/*:${i === 0 ? '' : lang}
 * ${lines.join('\n * ')}
 */`;
    }).join('\n\n');

    // struct
    const structures = (config.structure && config.structure.length > 0) ? locales.map((lang, i) => {
        return config.structure.map((structure) => {
            const lines = [];

            lines.push(generateProperties(structure.properties, lang));

            return `/*~struct~${structure.name}:${i === 0 ? '' : lang}
 * ${lines.join('\n * ')}
 */`;
        }).join('\n\n');
    }).join('\n\n') : '';

    return `${descriptions}${structures ? `\n\n${structures}` : ''}`;
}

function generateProperties(properties, lang) {
    const lines = [];

    properties.forEach(({ name, dummy, key, desc, type, array, ...others }, i) => {
        if (i > 0) lines.push('');

        if (dummy) {
            lines.push(`@param _${i}`);
            if (typeof dummy === 'object') {
                lines.push(`@text ${dummy[lang]}`);
            } else {
                lines.push(`@text ${dummy}`);
            }
            return;
        }

        lines.push(`@param ${key}`);
        if (name) lines.push(generateProp('text', lang, name));
        if (desc) lines.push(generateProp('desc', lang, desc));

        if (type) {
            lines.push(`@type ${type}${array ? '[]' : ''}`);
            switch (type) {
                case 'file':
                case 'animation':
                    lines.push('@require true');
                    break;
            }
        } else {
            lines.push('@type string');
        }

        Object.keys(others).forEach((key) => {
            const item = others[key];
            if (key === 'default' && array) {
                lines.push(generateProp(key, lang, JSON.stringify(item)));
            } else if (key === 'items' && Array.isArray(item)) {
                item.forEach((subItem) => {
                    Object.keys(subItem).forEach((subKey) => {
                        const subValue = subItem[subKey];
                        lines.push(generateProp(subKey === 'name' ? 'option' : subKey, lang, subValue));
                    });
                });
            } else {
                (Array.isArray(item) ? item : [item]).forEach((value) => {
                    lines.push(generateProp(key, lang, value));
                });
            }
        });
    });

    return lines.join('\n * ');
}

function generateProp(propName, lang, value, defaultValue = null) {
    if (typeof value === 'object') {
        return `@${propName} ${value[lang]}`;
    } else if (value) {
        return `@${propName} ${value}`;
    } else if (defaultValue) {
        return `@${propName} ${defaultValue}`;
    } else {
        return '';
    }
}

module.exports = {
    generateHeader
};
