module.exports = {
    roots: [
        "<rootDir>/test"
    ],
    testRegex: 'test/(.+)\\.test\\.(js|ts)$',
    // testRegex: '(/\_\_tests\_\_).*|(\\\\.|/)(test|spec))\\\\.jsx?$'
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

// jest.config.js
// module.exports = {
//     preset: "ts-jest",
//     testEnvironment: "node",
// };

// module.exports = {
//     clearMocks: true, // 是否每次运行清除mock
//     collectCoverageFrom: ['src/*.{js,ts}', 'src/**/*.{js,ts}'], //覆盖率文件
//       coverageDirectory: 'coverage', // 生成覆盖率的文件名
//       coverageProvider: 'v8', 
//       coverageThreshold: { // 覆盖率阈值
//       global: {
//         branches: 90,
//         functions: 95,
//         lines: 95,
//         statements: 95,
//       },
//    },
//    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'], // 文件扩展
//    preset: 'ts-jest', //ts
//    setupFilesAfterEnv: [ // 每次test的启动文件，类似main.ts
//       "<rootDir>/__tests__/boot.ts"
//    ],
//    testEnvironment: 'jest-environment-jsdom', // js
//    testRegex: '(/__tests__/.+\\.(test|spec))\\.(ts|tsx|js)$', // 要进行test的文件正则
//   };