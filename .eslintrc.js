module.exports = {
    extends: [
        '@chiyu-git/eslint-config-react',
    ],
    rules: {
        'no-restricted-syntax': [0, 'iterators/generators'],
        '@typescript-eslint/indent': [2, 4],
        '@typescript-eslint/type-annotation-spacing': [2, { after: true }],
        '@typescript-eslint/member-delimiter-style': [
            2,
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                multilineDetection: 'brackets',
            },
        ],
    },
};
