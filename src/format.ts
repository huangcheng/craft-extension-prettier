import prettier from 'prettier/standalone';
import angular from 'prettier/parser-angular';
import babel from 'prettier/parser-babel';
import espree from 'prettier/parser-espree';
import flow from 'prettier/parser-flow';
import glimmer from 'prettier/parser-glimmer';
import graphql from 'prettier/parser-graphql';
import html from 'prettier/parser-html';
import markdown from 'prettier/parser-markdown';
import meriyah from 'prettier/parser-meriyah';
import postcss from 'prettier/parser-postcss';
import typescript from 'prettier/parser-typescript';
import yaml from 'prettier/parser-yaml';

import type { CodeLanguage } from '@craftdocs/craft-extension-api';
import type { BuiltInParserName, Options } from 'prettier';

export const convertLanguageToParser = (language: CodeLanguage): BuiltInParserName => {
  switch (language) {
    case 'javascript':
      return 'babel';
    case 'typescript':
    case 'json':
    case 'css':
    case 'html':
    case 'markdown':
    case 'yaml':
      return language as BuiltInParserName;
    default:
      return 'babel';
  }
}

const format = (code: string, options: Options): string => {
  return prettier.format(code, {
    parser: 'babel',
    plugins: [angular, babel, espree, flow, glimmer, graphql, html, markdown, meriyah, postcss, typescript, yaml],
    ...options,
  });
};

export default format;
