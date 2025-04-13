import reactEslint from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import js from '@eslint/js';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'react': reactEslint,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
            'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
            'react/jsx-first-prop-new-line': ['error', 'multiline'],
            'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
            'react/self-closing-comp': [
                'error', {
                    'component': true,
                    'html': true,
                },
            ],
        },
    },

    // all files
    {
        plugins: { '@typescript-eslint': tseslint.plugin },
        rules: {
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: 'error',
            'comma-dangle': ['error', 'always-multiline'],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'object-curly-spacing': ['error', 'always'],
            'object-curly-newline': [
                'error', {
                    multiline: true, minProperties: 2,
                },
            ],
            'array-bracket-newline': [
                'error', {
                    multiline: true, minItems: 3,
                },
            ],
            'array-element-newline': ['error', { minItems: 3 }],
            '@typescript-eslint/no-namespace': 'off',
            'no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // config envs
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
);
