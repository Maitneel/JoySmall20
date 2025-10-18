'use strict';

const body = document.body;

const root = document.createElement('div');
root.id = 'root';
body.appendChild(root);

function createKeyBase(): HTMLDivElement {
  const keyBase: HTMLDivElement = document.createElement('div');
  keyBase.className = 'key_base';
  return keyBase;
}

function createKeyLabel(label: string = ''): HTMLDivElement {
  const div: HTMLDivElement = document.createElement('div');
  div.innerText = label;
  div.className = 'key_label';
  return div;
}

function createLayerLabel(label: string = ''): HTMLDivElement {
  const div: HTMLDivElement = document.createElement('div');
  div.innerText = label;
  div.className = 'layer_label';
  return div;
}

function createKey(rowIndex: number, colIndex: number, isLayerKey: boolean = false, keyLabel: string = 'N/A', layerLabel: string = '', idPrefix: string = 'key-'): HTMLDivElement {
  const keyBase: HTMLDivElement = createKeyBase();
  const key: HTMLDivElement = document.createElement('div');
  key.id = idPrefix + rowIndex + '-' + colIndex;
  if (isLayerKey) {
    key.className = 'key_common layer_key';
  } else {
    key.className = 'key_common';
  }
  const key_label = createKeyLabel(keyLabel);
  const layer_label = createLayerLabel(layerLabel);
  key.appendChild(key_label);
  key.appendChild(layer_label);

  keyBase.appendChild(key);
  return keyBase;
}

function createKeyRow(rowIndex: number, count: number, shouldAddKey: boolean[], isLayer: boolean[] | undefined = undefined, keyLabels: string[] | undefined, idPrefix: string = 'key-') {
  const row: HTMLDivElement = document.createElement('div');
  row.className = 'key_row';
  row.id = 'row-' + rowIndex;
  for (let i = 0; i < count; i++) {
    let key;
    if (shouldAddKey[i] !== false) {
      let keyLabel: string | undefined = undefined;
      let isLayerOption: boolean | undefined = false;
      if (isLayer !== undefined) {
        isLayerOption = isLayer[i] ?? false;
      }
      if (keyLabels && keyLabels[i]) {
        keyLabel = keyLabels[i];
      }
      key = createKey(rowIndex, i, isLayerOption, keyLabel, undefined, idPrefix);
    } else {
      key = createKeyBase();
    }
    row.appendChild(key);
  }
  return row;
}

function createLayerKeys(rowIndex: number) {
  const div: HTMLDivElement = document.createElement('div');
  div.className = 'key_row';
  const layerKey = createKey(rowIndex, 0, true, '', 'LAYER', 'layer');
  layerKey.getElementsByClassName('key_common')[0]!.id = 'add_layer_key';
  div.appendChild(layerKey);
  const resetLayerKey = createKey(rowIndex, 1, true, '', 'RESET\nLAYER', 'layer');
  resetLayerKey.getElementsByClassName('key_common')[0]!.id = 'remove_layer_key';
  div.appendChild(resetLayerKey)
  return div;
}

function createKeyboardArea(): HTMLDivElement {
  const keyboardArea: HTMLDivElement = document.createElement('div');
  keyboardArea.appendChild(createKeyRow(0, 5, [true, true, false, false, false], undefined, undefined, 'layer-'));
  keyboardArea.appendChild(createKeyRow(1, 5, [true, true, false, false, true], undefined, undefined, 'layer-'));
  keyboardArea.appendChild(createKeyRow(2, 5, [true, true, true, true, true], undefined, undefined, 'layer-'));
  keyboardArea.appendChild(createKeyRow(3, 5, [true, true, true, true, true], undefined, undefined, 'layer-'));
  keyboardArea.appendChild(createKeyRow(4, 5, [true, true, true, true, true], undefined, undefined, 'layer-'));
  return keyboardArea
}

function createKeyOptionsArea(): HTMLDivElement {
  const keyListArea: HTMLDivElement = document.createElement('div');
  keyListArea.className = 'key_options_area';
  keyListArea.id = 'key_options_area';

  const mainRows = [
    ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PRTSC', 'SCRLK', 'PAUSE'],
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BS'],
    ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'ENT'],
    ['L_SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'R_SHIFT'],
    ['L_CTRL', 'L_GUI', 'L_ALT', 'SPACE', 'R_ALT', 'R_GUI', 'MENU', 'R_CTRL'],
  ];

  const numpadRows = [
    ['NUMLC', 'KP_/', 'KP_*', 'KP_-'],
    ['KP_7', 'KP_8', 'KP_9', 'KP_+'],
    ['KP_4', 'KP_5', 'KP_6'],
    ['KP_1', 'KP_2', 'KP_3', 'KP_ENT'],
    ['KP_0', 'KP_.'],
  ];

  const mouseRow = ['MO_L', 'MO_MID', 'MO_R'];

  mainRows.forEach((row, i) => {
    const status = row.map(() => true);
    keyListArea.appendChild(createKeyRow(i, row.length, status, undefined, row, 'options-'));
  });

  keyListArea.appendChild(document.createElement('hr'))

  const numpadOffset = mainRows.length;
  numpadRows.forEach((row, i) => {
    const status = row.map(() => true);
    keyListArea.appendChild(createKeyRow(numpadOffset + i, row.length, status, undefined, row, 'options-'));
  });

  const layerKeys = createLayerKeys(mainRows.length + numpadRows.length);
  keyListArea.appendChild(layerKeys)

  const mouseKey = createKeyRow(mainRows.length + numpadRows.length + 1, mouseRow.length, mainRows.map(() => true), undefined, mouseRow, 'options-');

  keyListArea.appendChild(document.createElement('hr'));
  keyListArea.appendChild(mouseKey)

  return keyListArea;
}

function createLayoutChoices(): HTMLDivElement {
  const div: HTMLDivElement = document.createElement('div');

  const prevButton: HTMLButtonElement = document.createElement('button');
  const label: HTMLSpanElement = document.createElement('span');
  const addLayoutButton: HTMLButtonElement = document.createElement('button');
  const removeLayoutButton: HTMLButtonElement = document.createElement('button');
  const nextButton: HTMLButtonElement = document.createElement('button');

  prevButton.textContent = '←';
  label.textContent = 'layout 0'
  addLayoutButton.textContent = 'Add Layout';
  removeLayoutButton.textContent = 'Remove Layout';
  nextButton.textContent = '→';

  prevButton.className = 'layout_button';
  label.className = 'layout_label';
  addLayoutButton.className = 'layout_button';
  removeLayoutButton.className = 'layout_button';
  nextButton.className = 'layout_button';

  prevButton.id = 'layout_prev_button';
  label.id = 'layout_label';
  addLayoutButton.id = 'add_layout_button';
  removeLayoutButton.id = 'remove_layout_button';
  nextButton.id = 'layout_next_button';

  div.appendChild(prevButton);
  div.appendChild(label);
  div.appendChild(addLayoutButton);
  div.appendChild(removeLayoutButton);
  div.appendChild(nextButton);
  return div;
}

function createJoystickModeSelector(): HTMLDivElement {
  const div: HTMLDivElement = document.createElement('div');
  const span: HTMLSpanElement = document.createElement('span');
  span.textContent = 'Joystick Mode: ';
  const select: HTMLSelectElement = document.createElement('select');
  select.id = 'joystick_mode_selector';
  const optionCursor: HTMLOptionElement = document.createElement('option');
  optionCursor.textContent = 'Cursor';
  optionCursor.value = 'cursor';
  const optionWheel: HTMLOptionElement = document.createElement('option');
  optionWheel.textContent = 'Wheel';
  optionWheel.value = 'wheel';

  select.appendChild(optionCursor);
  select.appendChild(optionWheel);
  div.appendChild(span);
  div.appendChild(select);
  return div;
}

export function createPage(): void {
  root.appendChild(createLayoutChoices());
  root.appendChild(createJoystickModeSelector());
  root.appendChild(document.createElement('hr'))
  root.appendChild(createKeyboardArea());
  root.appendChild(document.createElement('hr'))
  root.appendChild(createKeyOptionsArea());
}
