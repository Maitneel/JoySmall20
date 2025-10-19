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

async function inputFile(): Promise<string> {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  return new Promise<string>((resolve, reject) => {
    input.onchange = () => {
    if (!input.files) {
        reject();
        return null;
      }
      const file = input.files[0];
      if (!file) {
        reject();
        return null;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject();
        }
      }
      reader.readAsText(file);
    }
    input.click();
  })
}

function initKeyMapEditor(): void {
  const keyMapEditor = new KeyMapEditor(createKeyMatrix(), document.getElementById('layout_label')!, document.getElementById('joystick_mode_selector')! as HTMLSelectElement);

  const optionsArea = document.getElementById('key_options_area')!;
  const options = optionsArea.getElementsByClassName('key_common');

  for (let i = 0; i < options.length; i++) {
    if (options.item(i)) {
      (options.item(i) as HTMLElement).onclick = () => {
        keyMapEditor.setKey(options[i]?.textContent ?? '');
      }
    }
  }
  const addLayerKey = document.getElementById('add_layer_key')!;
  addLayerKey.onclick = keyMapEditor.addLayer.bind(keyMapEditor);
  const removeLayerKey = document.getElementById('remove_layer_key')!;
  removeLayerKey.onclick = keyMapEditor.removeLayer.bind(keyMapEditor);

  const prevButton = document.getElementById('layout_prev_button')!;
  prevButton.onclick = keyMapEditor.changeToPrevLayout.bind(keyMapEditor);
  const addLayoutButton = document.getElementById('add_layout_button')!;
  addLayoutButton.onclick = keyMapEditor.addLayout.bind(keyMapEditor);
  const removeLayoutButton = document.getElementById('remove_layout_button')!;
  removeLayoutButton.onclick = keyMapEditor.removeLayout.bind(keyMapEditor);
  const nextButton = document.getElementById('layout_next_button')!;
  nextButton.onclick = keyMapEditor.changeToNextLayout.bind(keyMapEditor);
  const joystickModeSelector = document.getElementById('joystick_mode_selector')!;
  joystickModeSelector.onchange = keyMapEditor.setJoystickMode.bind(keyMapEditor);

  const downloadJsonBotton = document.getElementById('download_json')!;
  downloadJsonBotton.onclick = keyMapEditor.downloadJson.bind(keyMapEditor);

  const savedDate = window.localStorage.getItem('keymap');
  if (savedDate) {
    try {
      keyMapEditor.loadJson(savedDate);
    } catch (e) {
      console.error('failed load json', e);
    }
  }

  const importButton = document.getElementById('import_json')!;
  importButton.onclick = async () => {
    try {
      const text = await inputFile();
      keyMapEditor.loadJson(text);
    } catch (e) {
      alert('failed to import');
    }
  }

  const downloadCustomSizeButton = document.getElementById('download_custom_size')!
  downloadCustomSizeButton.onclick = keyMapEditor.downloadCustomSize.bind(keyMapEditor);
  const downloadCustomKeymapButton = document.getElementById('download_custom_keymap')!
  downloadCustomKeymapButton.onclick = keyMapEditor.downloadCustomKeymap.bind(keyMapEditor);

  window.onbeforeunload = () => {
    window.localStorage.setItem('keymap', keyMapEditor.json());
  }
}

function main(): void {
  createPage();
  initKeyMapEditor();
  //document.getElementById('layer-4-0')!.classList.add('layer_key');
}

main();
