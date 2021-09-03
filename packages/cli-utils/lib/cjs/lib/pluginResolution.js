"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesPluginId = exports.resolvePluginId = exports.toShortPluginId = exports.isOfficialPlugin = exports.isPlugin = void 0;
const pluginRE = /^(@maf\/|maf-|@[\w-]+(\.)?[\w-]+\/maf-)cli-plugin-/;
const scopeRE = /^@[\w-]+(\.)?[\w-]+\//;
const officialRE = /^@maf\//;
const officialPlugins = [
    'java-spring-boot',
    'java-gen',
];
const isPlugin = (id) => pluginRE.test(id);
exports.isPlugin = isPlugin;
const isOfficialPlugin = (id) => (0, exports.isPlugin)(id) && officialRE.test(id);
exports.isOfficialPlugin = isOfficialPlugin;
const toShortPluginId = (id) => id.replace(pluginRE, '');
exports.toShortPluginId = toShortPluginId;
const resolvePluginId = (id) => {
    // already full id
    // e.g. vue-cli-plugin-foo, @maf/cli-plugin-foo, @bar/vue-cli-plugin-foo
    if (pluginRE.test(id)) {
        return id;
    }
    if (id === '@maf/cli-service') {
        return id;
    }
    if (officialPlugins.includes(id)) {
        return `@maf/cli-plugin-${id}`;
    }
    // scoped short
    // e.g. @maf/foo, @bar/foo
    if (id.charAt(0) === '@') {
        const scopeMatch = id.match(scopeRE);
        if (scopeMatch) {
            const scope = scopeMatch[0];
            const shortId = id.replace(scopeRE, '');
            return `${scope}${scope === '@maf/' ? `` : `vue-`}cli-plugin-${shortId}`;
        }
    }
    // default short
    // e.g. foo
    return `maf-cli-plugin-${id}`;
};
exports.resolvePluginId = resolvePluginId;
const matchesPluginId = (input, full) => {
    const short = full.replace(pluginRE, '');
    return (
    // input is full
    full === input ||
        // input is short without scope
        short === input ||
        // input is short with scope
        short === input.replace(scopeRE, ''));
};
exports.matchesPluginId = matchesPluginId;
// export const getPluginLink = id => {
//   if (officialRE.test(id)) {
//     return `https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-${
//       toShortPluginId(id)
//     }`
//   }
//   let pkg = {}
//   try {
//     pkg = require(`${id}/package.json`)
//   } catch (e) {}
//   return (
//     pkg.homepage ||
//     (pkg.repository && pkg.repository.url) ||
//     `https://www.npmjs.com/package/${id.replace(`/`, `%2F`)}`
//   )
// }
