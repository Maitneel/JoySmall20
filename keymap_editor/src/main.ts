import { createPage } from "./page_generator.js";
import { KeyMapEditor } from './keymap_editor.js'

function createKeyMatrix(): HTMLElement[][] {
  let keyMatrix: HTMLElement[][] = [];
  for (let i = 0; i < 4; i++) {
    keyMatrix[i] = new Array(5);
  }

  const firstRow = keyMatrix[0];
  if (firstRow) {
    for (let j = 0; j < firstRow.length; j++) {
      if (j === 2 || j === 3) {
        firstRow[j] = document.getElementById('layer-0-' + (j - 2))!;
      } else {
        firstRow[j] = document.getElementById('layer-1-' + j)!;
      }
    }
  }
  for (let i = 1; i < keyMatrix.length; i++) {
    const currentRow = keyMatrix[i];
    if (!currentRow) {
      continue;
    }
    for (let j = 0; j < currentRow.length; j++) {
      currentRow[j] = document.getElementById('layer-' + (i + 1) + '-' + j)!;
    }
  }
  return keyMatrix;
}

function initKeyMapEditor(): void {
  const keyMapEditor = new KeyMapEditor(createKeyMatrix());

  const optionsArea = document.getElementById('key_options_area')!;
  const options = optionsArea.getElementsByClassName('key_common');

  for (let i = 0; i < options.length; i++) {
    if (options.item(i)) {
      (options.item(i) as HTMLElement).onclick = () => {
        keyMapEditor.updateKey(options[i]?.textContent ?? '');
      }
    }
  }
}

function main(): void {
  createPage();
  initKeyMapEditor();
  document.getElementById('layer-4-0')!.classList.add('layer_key');
}

main();
