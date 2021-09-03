const {
    isPlugin,
    isOfficialPlugin,
    toShortPluginId,
    resolvePluginId,
    matchesPluginId
  } = require('../../src/lib/pluginResolution')
  
  test('isPlugin', () => {
    expect(isPlugin('foobar')).toBe(false)
    expect(isPlugin('@maf/cli-plugin-foo')).toBe(true)
    expect(isPlugin('maf-cli-plugin-foo')).toBe(true)
    expect(isPlugin('@foo/maf-cli-plugin-foo')).toBe(true)
    expect(isPlugin('@foo.bar/maf-cli-plugin-foo')).toBe(true)
  })
  
  test('isOfficialPlugin', () => {
    expect(isOfficialPlugin('@maf/foo')).toBe(false)
    expect(isOfficialPlugin('@maf/cli-plugin-foo')).toBe(true)
    expect(isOfficialPlugin('maf-cli-plugin-foo')).toBe(false)
    expect(isOfficialPlugin('@foo/maf-cli-plugin-foo')).toBe(false)
    expect(isOfficialPlugin('@foo.bar/maf-cli-plugin-foo')).toBe(false)
  })
  
  test('toShortPluginId', () => {
    expect(toShortPluginId('@maf/cli-plugin-foo')).toBe('foo')
    expect(toShortPluginId('maf-cli-plugin-foo')).toBe('foo')
    expect(toShortPluginId('@foo/maf-cli-plugin-foo')).toBe('foo')
    expect(toShortPluginId('@foo.bar/maf-cli-plugin-foo')).toBe('foo')
  })
  
  test('resolvePluginId', () => {
    // already full
    expect(resolvePluginId('@maf/cli-plugin-foo')).toBe('@maf/cli-plugin-foo')
    expect(resolvePluginId('maf-cli-plugin-foo')).toBe('maf-cli-plugin-foo')
    expect(resolvePluginId('@foo/maf-cli-plugin-foo')).toBe('@foo/maf-cli-plugin-foo')
    expect(resolvePluginId('@foo.bar/maf-cli-plugin-foo')).toBe('@foo.bar/maf-cli-plugin-foo')
  
    // scoped short
    expect(resolvePluginId('@maf/foo')).toBe('@maf/cli-plugin-foo')
    expect(resolvePluginId('@foo/foo')).toBe('@foo/maf-cli-plugin-foo')
    expect(resolvePluginId('@foo.bar/foo')).toBe('@foo.bar/maf-cli-plugin-foo')
  
    // default short
    expect(resolvePluginId('foo')).toBe('maf-cli-plugin-foo')
  })
  
  test('matchesPluginId', () => {
    // full
    expect(matchesPluginId('@maf/cli-plugin-foo', '@maf/cli-plugin-foo')).toBe(true)
    expect(matchesPluginId('maf-cli-plugin-foo', 'maf-cli-plugin-foo')).toBe(true)
    expect(matchesPluginId('@foo/maf-cli-plugin-foo', '@foo/maf-cli-plugin-foo')).toBe(true)
    expect(matchesPluginId('@foo.bar/maf-cli-plugin-foo', '@foo.bar/maf-cli-plugin-foo')).toBe(true)
  
    // short without scope
    expect(matchesPluginId('foo', '@maf/cli-plugin-foo')).toBe(true)
    expect(matchesPluginId('foo', 'maf-cli-plugin-foo')).toBe(true)
    expect(matchesPluginId('foo', '@foo/maf-cli-plugin-foo')).toBe(true)
    expect(matchesPluginId('foo', '@foo.bar/maf-cli-plugin-foo')).toBe(true)
  
    // short with scope
    expect(matchesPluginId('@maf/foo', '@maf/cli-plugin-foo')).toBe(true)
    expect(matchesPluginId('@foo/foo', '@foo/maf-cli-plugin-foo')).toBe(true)
    expect(matchesPluginId('@foo.bar/foo', '@foo.bar/maf-cli-plugin-foo')).toBe(true)
  })
  