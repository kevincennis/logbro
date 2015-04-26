module.exports = {
  src: [ 'lib/**/*.js', 'index.js' ],
  options: {
    esnext: true,
    requireCurlyBraces: [
      'if',
      'else',
      'for',
      'while',
      'do',
      'try',
      'catch'
    ],
    requireSpaceAfterKeywords: [
      'if',
      'else',
      'for',
      'while',
      'do',
      'switch',
      'return',
      'try',
      'catch'
    ],
    requireSpaceBeforeBlockStatements: true,
    requireParenthesesAroundIIFE: true,
    requireSpacesInConditionalExpression: true,
    requireSpacesInFunctionExpression: {
      beforeOpeningCurlyBrace: true
    },
    requireSpacesInAnonymousFunctionExpression: {
      beforeOpeningCurlyBrace: true
    },
    requireSpacesInNamedFunctionExpression: {
      beforeOpeningCurlyBrace: true
    },
    disallowSpacesInNamedFunctionExpression: {
      beforeOpeningRoundBrace: true
    },
    requireSpacesInFunctionDeclaration: {
      beforeOpeningCurlyBrace: true
    },
    disallowSpacesInFunctionDeclaration: {
      beforeOpeningRoundBrace: true
    },
    requireMultipleVarDecl: true,
    requireBlocksOnNewline: true,
    disallowEmptyBlocks: true,
    requireSpacesInsideObjectBrackets: 'all',
    requireSpacesInsideArrayBrackets: 'all',
    requireOperatorBeforeLineBreak: [
      '?',
      '=',
      '+',
      '-',
      '/',
      '*',
      '==',
      '===',
      '!=',
      '!==',
      '>',
      '>=',
      '<',
      '<='
    ],
    disallowSpaceBeforePostfixUnaryOperators: true,
    requireSpacesInConditionalExpression: true,
    requireSpaceAfterBinaryOperators: true,
    disallowSpaceAfterPrefixUnaryOperators: true,
    requireSpacesInConditionalExpression: true,
    disallowSpaceAfterPrefixUnaryOperators: [
      '++',
      '--',
      '+',
      '-'
    ],
    disallowSpaceBeforePostfixUnaryOperators: [
      '++',
      '--'
    ],
    requireSpaceBeforeBinaryOperators: [
      '+',
      '-',
      '\/',
      '*',
      '=',
      '==',
      '===',
      '!=',
      '!==',
      '>',
      '>=',
      '<',
      '<='
    ],
    requireSpaceAfterBinaryOperators: [
      '+',
      '-',
      '\/',
      '*',
      '=',
      '==',
      '===',
      '!=',
      '!==',
      '>',
      '>=',
      '<',
      '<='
    ],
    disallowKeywords: [
      'with'
    ],
    disallowMultipleLineStrings: true,
    disallowMultipleLineBreaks: true,
    disallowKeywordsOnNewLine: [
      'else',
      'catch'
    ],
    requireLineFeedAtFileEnd: true,
    validateLineBreaks: 'LF',
    validateQuoteMarks: '\'',
    validateIndentation: 2,
    disallowMixedSpacesAndTabs: true,
    disallowTrailingWhitespace: true,
    disallowTrailingComma: true,
    requireCapitalizedConstructors: true,
    requireDotNotation: true,

    // custom rules
    additionalRules: [ 'build/stylerules/*.js' ],
    requireSpacesInsideSquareBrackets: 'all',
    disallowNoVarOnFirstLine: 'all',
  }
};
