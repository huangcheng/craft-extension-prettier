import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';

import type { ForwardRefExoticComponent, ReactElement, RefAttributes } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import type { BuiltInParserName, Options } from 'prettier';

import { parsers, defaultOptions } from '../../consts';

export interface OptionFields extends Partial<Omit<Options, 'parser' | 'plugins'>> {
  parser?: BuiltInParserName;
  printWidth?: number;
  useTabs?: boolean;
}

export interface OptionPros {
  options?: OptionFields;
  onSubmit?: (data: OptionFields) => void;
  onChange?: (data: OptionFields) => void;
}

export interface FormRef {
  setValue: UseFormSetValue<OptionFields>
}

const Option: ForwardRefExoticComponent<OptionPros & RefAttributes<unknown>> = forwardRef((props: OptionPros, ref): ReactElement<OptionPros> => {
  const { options = {}, onSubmit, onChange } = props;

  const defaultValues = Object.assign(defaultOptions, options);

  const { register, handleSubmit, watch, setValue } = useForm<OptionFields>({
    defaultValues,
  });

  const [bracketSpace, semi] = watch(['bracketSpacing', 'semi']);

  useEffect(() => {
    const subscription = watch((value) => onChange?.(value as OptionFields));

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  useEffect(() => {
    if (options?.parser !== undefined) {
      setValue('parser', options?.parser);
    }
  }, [options?.parser, setValue]);

  useImperativeHandle<unknown, FormRef>(ref, () => ({
    setValue,
  }));

  return (
    <form className="options-container open" onSubmit={onSubmit === undefined ? undefined : handleSubmit(onSubmit)}>
      <div className="options">
        <details className="sub-options">
          <summary>
            Global
          </summary>
          <label>
            --parser
            <select {...register('parser', {})}>
              {parsers.map((parser) => <option key={parser} value={parser}>{parser}</option>)}
            </select>
          </label>
          <label>
            --print-width
            <input type="number" {...register('printWidth', { valueAsNumber: true })}/>
          </label>
          <label>
            --tab-width
            <input type="number" {...register('tabWidth', { valueAsNumber: true })}/>
          </label>
          <label>
            --use-tabs
            <input type="checkbox" {...register('useTabs', )}/>
          </label>
          <label>
            --embedded-language-formatting
            <select {...register('embeddedLanguageFormatting', {})}>
              {['auto', 'off'].map((parser) => <option key={parser} value={parser}>{parser}</option>)}
            </select>
          </label>
        </details>
        <details className="sub-options">
          <summary>
            Common
          </summary>
          <label>
            --single-quote
            <input type="checkbox" {...register('singleQuote')}/>
          </label>
          <label>
            --no-bracket-spacing
            <input
              type="checkbox"
              checked={!bracketSpace}
              onChange={(e) => {
                setValue('bracketSpacing', !e.target.checked);
              }}
            />
          </label>
          <label>
            --prose-wrap
            <select {...register('proseWrap')}>
              {['always', 'never', 'preserve'].map((parser) => <option key={parser} value={parser}>{parser}</option>)}
            </select>
          </label>
        </details>
        <details className="sub-options">
          <summary>
            JavaScript
          </summary>
          <label>
            --no-semi
            <input
              type="checkbox"
              checked={!semi}
              onChange={(e) => {
                setValue('semi', !e.target.checked);
              }}
            />
          </label>
          <label>
            --jsx-single-quote
            <input type="checkbox" {...register('jsxSingleQuote')} />
          </label>
          <label>
            --quote-props
            <select {...register('quoteProps' )} >
              {['as-needed', 'consistent', 'preserve'].map((parser) => <option key={parser} value={parser}>{parser}</option>)}
            </select>
          </label>
          <label>
            --arrow-parens
            <select {...register('arrowParens')}>
              {['always', 'avoid'].map((parser) => <option key={parser} value={parser}>{parser}</option>)}
            </select>
          </label>
          <label>
            --trailing-comma
            <select {...register('trailingComma')}>
              {['es5', 'none', 'all'].map((parser) => <option key={parser} value={parser}>{parser}</option>)}
            </select>
          </label>
        </details>
        <details className="sub-options">
          <summary>
            HTML
          </summary>
          <label>
            --html-whitespace-sensitivity
            <select {...register('htmlWhitespaceSensitivity')}>
              {['css', 'strict', 'ignore'].map((parser) => <option key={parser} value={parser}>{parser}</option>)}
            </select>
          </label>
          <label>
            --vue-indent-script-and-style
            <input type="checkbox" {...register('vueIndentScriptAndStyle')} />
          </label>
        </details>
        <details className="sub-options">
          <summary>
            Special
          </summary>
          <label>
            --insert-pragma
            <input type="checkbox" {...register('insertPragma')} />
          </label>
          <label>
            --require-pragma
            <input type="checkbox" {...register('requirePragma')} />
          </label>
        </details>
      </div>
    </form>
  );
});

Option.displayName = 'Option';

export default Option;
