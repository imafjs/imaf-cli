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