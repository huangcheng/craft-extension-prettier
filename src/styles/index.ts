/**
 * styles from prettier playground
 * @link https://github.com/prettier/prettier/blob/main/website/static/separate-css/playground.css
 */

const useStyles = (): string => (`
  .options-container {
    display: none;
    box-sizing: border-box;
    width: 225px;
    overflow-y: auto;
    border-bottom: 1px solid #ddd;
    flex: 0 1 auto;
  }

  .options-container.open {
    display: block;
  }

  .options {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: auto;
  }

  .sub-options {
    flex: 1;
    padding: 15px 0 10px;
    border-bottom: 1px solid #ddd;
  }

  .sub-options:last-child {
    border: 0;
  }

  .sub-options > summary {
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 5px;
    cursor: pointer;
  }

  .sub-options > summary:focus {
    outline: 0;
  }

  .sub-options > * {
    margin-left: 10px;
  }

  label {
    font-family: Consolas, Courier New, Courier, monospace;
    margin: 10px 0;
    display: block;
  }

  input[type="number"] {
    max-width: 40px;
  }

  .btn {
    box-sizing: content-box;
    display: inline-block;
    height: 18px;
    padding: 0 5px;
    border: 1px solid #d1d2d3;
    border-radius: 0.25em;
    background-image: linear-gradient(to bottom, #fafbfc, #e4ebf0);
    font-size: 11px;
    line-height: 18px;
    font-weight: 600;
    font-family: inherit;
    color: #24292e;
    text-decoration: none;
    cursor: pointer;
    outline: none;
    position: relative;
  }
`);

export default useStyles;
