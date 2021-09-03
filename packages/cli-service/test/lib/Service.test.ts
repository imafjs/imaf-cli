jest.mock('fs')
jest.mock('MAF-cli-plugin-foo', () => () => {}, { virtual: true })

const fs = require('fs')
const path = require('path')
import { semver } from '@maf/cli-utils'
import {Service} from '../../src/lib/Service'

const mockPkg = (json:any) => {
  fs.writeFileSync('/package.json', JSON.stringify(json, null, 2))
}

const createMockService = async (plugins?:any, init?:boolean, mode?: any) => {
  plugins = plugins || [];
  init = init || true
  const service = new Service('/', {
    plugins,
    useBuiltIn: false
  })
  if (init) {
    await service.init(mode)
  }
  return service
}

beforeEach(() => {
  mockPkg({})
  delete process.env.NODE_ENV
  delete process.env.BABEL_ENV
  delete process.env.FOO
  delete process.env.BAR
  delete process.env.BAZ
})

afterEach(() => {
  if (fs.existsSync('/maf.config.js')) {
    fs.unlinkSync('/maf.config.js')
  }
})

test('env loading', async () => {
  process.env.FOO = '0'
  fs.writeFileSync('/.env.local', `FOO=1\nBAR=2`)
  fs.writeFileSync('/.env', `BAR=3\nBAZ=4`)
  await createMockService()

  expect(process.env.FOO).toBe('0')
  expect(process.env.BAR).toBe('2')
  expect(process.env.BAZ).toBe('4')

  fs.unlinkSync('/.env.local')
  fs.unlinkSync('/.env')
})

test('env loading for custom mode', async () => {
  process.env.MAF_CLI_TEST_TESTING_ENV = 'true'
  fs.writeFileSync('/.env', 'FOO=1')
  fs.writeFileSync('/.env.staging', 'FOO=2\nNODE_ENV=production')
  await createMockService([], true, 'staging')

  expect(process.env.FOO).toBe('2')
  expect(process.env.NODE_ENV).toBe('production')

  process.env.MAF_CLI_TEST_TESTING_ENV = 'false'
  fs.unlinkSync('/.env')
  fs.unlinkSync('/.env.staging')
})

test('loading plugins from package.json', () => {
  mockPkg({
    devDependencies: {
      bar: '^1.0.0',
      '@MAF/cli-plugin-babel': '^5.0.0-beta.2',
      'MAF-cli-plugin-foo': '^1.0.0'
    }
  })
  // const service = new Service('/', {
  //   plugins:[],
  //   useBuiltIn: false
  // }) // this one needs to read from package.json
  // expect(service.plugins.some((plugin:{ id:string }) => plugin.id === '@MAF/cli-plugin-babel')).toBe(true)
  // expect(service.plugins.some((plugin:{ id:string }) => plugin.id === 'MAF-cli-plugin-foo')).toBe(true)
  // expect(service.plugins.some((plugin:{ id:string }) => plugin.id === 'bar')).toBe(false)
})

test('load project options from package.json', async () => {
  mockPkg({
    maf: {
      lintOnSave: 'default'
    }
  })
  const service = await createMockService()
  expect(service.projectOptions.lintOnSave).toBe('default')
})

test('handle option publicPath and outputDir correctly', async () => {
  mockPkg({
    maf: {
      publicPath: 'https://foo.com/bar',
      outputDir: '/public/'
    }
  })
  const service = await createMockService()
  expect(service.projectOptions.publicPath).toBe('https://foo.com/bar/')
  expect(service.projectOptions.outputDir).toBe('/public')
})

test('normalize publicPath when relative', async () => {
  mockPkg({
    maf: {
      publicPath: './foo/bar'
    }
  })
  const service = await createMockService()
  expect(service.projectOptions.publicPath).toBe('foo/bar/')
})

test('allow custom protocol in publicPath', async () => {
  mockPkg({
    maf: {
      publicPath: 'customprotocol://foo/bar'
    }
  })
  const service = await createMockService()
  expect(service.projectOptions.publicPath).toBe('customprotocol://foo/bar/')
})

test('keep publicPath when empty', async () => {
  mockPkg({
    maf: {
      publicPath: ''
    }
  })
  const service = await createMockService()
  expect(service.projectOptions.publicPath).toBe('')
})

test('load project options from maf.config.js', async () => {
  fs.writeFileSync(path.resolve('/', 'maf.config.js'), '') // only to ensure fs.existsSync returns true
  jest.mock(path.resolve('/', 'maf.config.js'), () => ({ lintOnSave: false }), { virtual: true })
  mockPkg({
    maf: {
      lintOnSave: 'default'
    }
  })
  const service = await createMockService()
  // maf.config.js has higher priority
  expect(service.projectOptions.lintOnSave).toBe(false)
})

test('load project options from maf.config.js as a function', async () => {
  fs.writeFileSync(path.resolve('/', 'maf.config.js'), '')
  jest.mock(path.resolve('/', 'maf.config.js'), () => function () { return { lintOnSave: false } }, { virtual: true })
  mockPkg({
    maf: {
      lintOnSave: 'default'
    }
  })
  const service = await createMockService()
  // maf.config.js has higher priority
  expect(service.projectOptions.lintOnSave).toBe(false)
})

test('api: assertVersion', async () => {
  const plugin = {
    id: 'test-assertVersion',
    apply: (api :any) => {
      const majorVersionNumber = semver.major(api.version)
      expect(() => api.assertVersion(majorVersionNumber)).not.toThrow()
      expect(() => api.assertVersion(`^${majorVersionNumber}.0.0-0`)).not.toThrow()
      // expect(() => api.assertVersion('>= 4')).not.toThrow()

      expect(() => api.assertVersion(4.1)).toThrow('Expected string or integer value')
      expect(() => api.assertVersion('^100')).toThrow('Require @MAF/cli-service "^100"')
    }
  }
  await createMockService([plugin], true /* init */)
})

test('api: registerCommand', async () => {
  let args
  const service = await createMockService([{
    id: 'test',
    apply: (api :any) => {
      api.registerCommand('foo', (_args:any) => {
        args = _args
      })
    }
  }])

  await service.run('foo', { n: 1 })
  expect(args).toEqual({ _: [], n: 1 })
})

test('api: --skip-plugins', async () => {
  let untouched = true
  const service = await createMockService([{
    id: 'test-command',
    apply: (api :any) => {
      api.registerCommand('foo', (_args:any) => {

      })
    }
  },
  {
    id: 'MAF-cli-plugin-test-plugin',
    apply: (api :any) => {
      untouched = false
    }
  }], false)

  await service.run('foo', { 'skip-plugins': 'test-plugin' })
  expect(untouched).toEqual(true)
})

test('api: defaultModes', async () => {
  fs.writeFileSync('/.env.foo', `FOO=5\nBAR=6`)
  fs.writeFileSync('/.env.foo.local', `FOO=7\nBAZ=8`)

  const plugin1:any = {
    id: 'test-defaultModes',
    apply: (api :any): any => {
      expect(process.env.FOO).toBe('7')
      expect(process.env.BAR).toBe('6')
      expect(process.env.BAZ).toBe('8')
      // for NODE_ENV & BABEL_ENV
      // any mode that is not test or production defaults to development
      expect(process.env.NODE_ENV).toBe('development')
      expect(process.env.BABEL_ENV).toBe('development')
      api.registerCommand('foo', () => {})
    } 
  }
  plugin1.apply.defaultModes = {
    foo: 'foo'
  }

  await (await createMockService([plugin1], false /* init */)).run('foo')

  delete process.env.NODE_ENV
  delete process.env.BABEL_ENV

  const plugin2:any = {
    id: 'test-defaultModes',
    apply: (api :any): any => {
      expect(process.env.NODE_ENV).toBe('test')
      expect(process.env.BABEL_ENV).toBe('test')
      api.registerCommand('test', () => {})
    }
  }
  plugin2.apply.defaultModes = {
    test: 'test'
  }

  await (await createMockService([plugin2], false /* init */)).run('test')
})

test('api: configureDevServer', async () => {
  const cb = () => {}
  const service = await createMockService([{
    id: 'test',
    apply: (api :any) => {
      api.configureDevServer(cb)
    }
  }])
  expect(service.devServerConfigFns).toContain(cb)
})

test('api: resolve', async () => {
  await createMockService([{
    id: 'test',
    apply: (api :any) => {
      expect(api.resolve('foo.js')).toBe(path.resolve('/', 'foo.js'))
    }
  }])
})

test('api: hasPlugin', async () => {
  await createMockService([
    {
      id: 'MAF-cli-plugin-foo',
      apply: (api :any) => {
        expect(api.hasPlugin('bar')).toBe(true)
        expect(api.hasPlugin('@MAF/cli-plugin-bar')).toBe(true)
      }
    },
    {
      id: '@MAF/cli-plugin-bar',
      apply: (api :any) => {
        expect(api.hasPlugin('foo')).toBe(true)
        expect(api.hasPlugin('MAF-cli-plugin-foo')).toBe(true)
      }
    }
  ])
})

test('order: service plugins order', async () => {
  const applyCallOrder:any[] = []
  function apply (id:string, order?:any) {
    order = order || {}
    const fn:any = jest.fn(() => { applyCallOrder.push(id) })
    fn.after = order.after
    return fn
  }
  const service = new Service('/', {
    plugins: [
      {
        id: 'MAF-cli-plugin-foo',
        apply: apply('MAF-cli-plugin-foo')
      },
      {
        id: 'MAF-cli-plugin-bar',
        apply: apply('MAF-cli-plugin-bar', { after: 'MAF-cli-plugin-baz' })
      },
      {
        id: 'MAF-cli-plugin-baz',
        apply: apply('MAF-cli-plugin-baz')
      }
    ],
    useBuiltIn: false
  })
  expect(service.plugins.map((p:any) => p.id)).toEqual([
    'built-in:commands/serve',
    'built-in:commands/build',
    'built-in:commands/inspect',
    'built-in:commands/help',
    'built-in:config/base',
    'built-in:config/assets',
    'built-in:config/css',
    'built-in:config/prod',
    'built-in:config/app',
    'MAF-cli-plugin-foo',
    'MAF-cli-plugin-baz',
    'MAF-cli-plugin-bar'
  ])

  await service.init()
  expect(applyCallOrder).toEqual([
    'MAF-cli-plugin-foo',
    'MAF-cli-plugin-baz',
    'MAF-cli-plugin-bar'
  ])
})
