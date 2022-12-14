module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/**/**/**/*.test.ts'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    reporters: [
        'default',
        [
            './node_modules/jest-html-reporter',
            {
                pageTitle: 'Test Report',
            },
        ],
    ],
}


