import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Global } from '@emotion/react';
import { ThemeProvider } from '@emotion/react';
import { Observable, interval } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';

import type { FC, ReactElement } from 'react';
import type { CodeLanguage, CraftBlock, CraftCodeBlock } from '@craftdocs/craft-extension-api';

import useStyles from './styles';
import format, { convertLanguageToParser } from './format';
import { Option } from './components';
import { dark, light } from './themes';
import { defaultOptions } from './consts';

import type { Theme } from './themes';
import type { OptionFields, FormRef } from './components/option';

const selection$ = new Observable<CraftBlock[]>(subscriber => {
  void craft.editorApi.getSelection().then((result) => {
    if (result.status !== 'success') {
      throw new Error(result.message);
    }

    subscriber.next(result.data);

    subscriber.complete();
  })
});

const timer$ = interval(2000);

const App: FC = (): ReactElement => {
  const isDarkMode = useCraftDarkMode();

  const theme = useMemo<Theme>(() => isDarkMode ? dark : light, [isDarkMode]);
  const styles = useStyles();

  const ref = useRef<FormRef | null>(null);

  const [codeBlock, setCodeBlock] = useState<CraftCodeBlock | null>(null);
  const [options, setOptions] = useState<OptionFields>(defaultOptions);

  useEffect(() => {
    const subscription$ = timer$.pipe(
      switchMap(() => selection$.pipe(
        distinctUntilChanged(),
        map<CraftBlock[], CraftCodeBlock[]>((blocks) => blocks.filter((block) => block.type === 'codeBlock') as CraftCodeBlock[]),
      )),
    ).subscribe((blocks) => {
      const block = blocks[0];

      if (block !== undefined && block.id !== codeBlock?.id) {
        setCodeBlock(block);
      }
    });

    return () => {
      subscription$.unsubscribe();
    }
  }, [setCodeBlock, codeBlock]);

  const code = useMemo<string>(() => codeBlock?.code?.replace(/\\n/g, '\n') ?? '', [codeBlock]);
  const language = useMemo<CodeLanguage>(() => codeBlock?.language ?? 'javascript', [codeBlock]);

  useEffect(() => {
    const parser = convertLanguageToParser(language);

    if (ref.current !== null) {
      ref.current.setValue('parser', parser);
    }
  }, [ref, language])

  const formatted = useMemo<string>(() => {
    try {
      return format(code, options);
    } catch (error) {
      return String(error);
    }
  }, [code, options]);

  const extensions = useMemo(() => {
    switch (language) {
      case 'json':
      case 'html':
      case 'css':
      case 'markdown':
        return [langs[language]()];
      default:
        return [langs['javascript']({ jsx: true })];
    }
  }, [language]);

  return (
    <ThemeProvider theme={theme}>
      <Global styles={styles} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CodeMirror
          value={formatted}
          extensions={extensions}
          height="200px"
          width="260px"
          readOnly={true}
        />
        <button
          className="btn"
          style={{
            margin: '10px 0',
          }}
          onClick={() => {
            try {
              const result = format(code, options);
              const block = {
                ...codeBlock,
                code: result,
              }

              void craft.dataApi.updateBlocks([ block as CraftCodeBlock ]);
            } catch {}
          }}
        >
          format
        </button>
        <Option
          ref={ref}
          options={options}
          onChange={setOptions}
        />
      </div>
    </ThemeProvider>
  );
}

function useCraftDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    craft.env.setListener(env => setIsDarkMode(env.colorScheme === 'dark'));
  }, []);

  return isDarkMode;
}


export default App;
