module.exports = {
    extends: [
        '@chiyu-git/eslint-config-react',
    ],
    rules: {
        'react/jsx-equals-spacing': [2, 'always'],
        'react/jsx-curly-spacing': [2, { 'when': 'always', 'children': true }],
    },
};
