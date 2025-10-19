import type { TwoDimIndex } from "./interface/Two-Dim-Index.js";
import { LayerStatus } from "./constants/Layer-Status.js";
import { Layer } from "./layer.js";
import { Layout } from "./layout.js";


export class KeyMapEditor {
  height: number;
  width: number;
  buttons: HTMLElement[][];
  layoutLabel: HTMLSpanElement;
  joystickModeSelector: HTMLSelectElement;
  targetingKey: HTMLElement | undefined = undefined;
  targetingIndex: TwoDimIndex | undefined;
  editingLayout: number = 0;;
  layouts: Layout[] = [];
  layerButtonCount: number = 0;

  constructor(buttons: HTMLElement[][], label: HTMLSpanElement, joystickModeSelector: HTMLSelectElement) {
    this.buttons = buttons;
    this.height = buttons.length;
    this.width = 0;
    this.editingLayout = 0;
    for (let i = 0; i < buttons.length; i++) {
      const row = buttons[i];
      if (!row) {
        continue;
      }
      this.width = Math.max(this.width, row.length ?? 0);
      for (let j = 0; j < row.length; j++) {
        const currentButton = row[j];
        if (!currentButton) {
          continue;
        }
        this.setClickHandler(i, j, currentButton);
      }
    }
    this.layouts[0] = new Layout(this.height, this.width);
    this.layoutLabel = label;
    this.joystickModeSelector = joystickModeSelector;
  }

  private setClickHandler(i: number, j: number, currentButton: HTMLElement) {
    currentButton.onclick = () => {
      if (this.targetingKey) {
        this.targetingKey.classList.remove('targeting_key', 'targeting_layer_key');
      }
      if (!this.targetingIndex) {
        this.targetingIndex = { i, j }
      }
      this.targetingIndex.i = i;
      this.targetingIndex.j = j;
      this.targetingKey = currentButton;
      this.targetingKey.classList.add('targeting_key');
      if (this.targetingKey.classList.contains('pressed_layer_key')) {
        this.switchLayer({i, j})
        this.targetingKey.classList.remove('pressed_layer_key');
      } else if (this.targetingKey.classList.contains('layer_key')) {
        this.switchLayer({i, j})
        this.targetingKey.classList.add('targeting_layer_key');
        this.targetingKey.classList.add('pressed_layer_key');
      }
    }
  }

  private switchLayer(index: TwoDimIndex): void {
    const layout = this.layouts[this.editingLayout];
    if (!layout || !this.targetingIndex) {
      return;
    }
    layout.switchLayer(this.targetingIndex);
    this.reRender();
  }

  updateHTMLClassName(): void {
    const layout = this.layouts[this.editingLayout];
    if (!layout) {
      return;
    }
    const layerStatus = layout.getLayerStatus();
    for (let i = 0; i < this.buttons.length; i++) {
      const buttonsRow = this.buttons[i];
      if (!buttonsRow) {
        continue
      }
      for (let j = 0; j < buttonsRow.length; j++) {
        const button = buttonsRow[j];
        const status = layerStatus[i * this.width + j];
        if (!button || status === undefined) {
          continue;
        }
        button.classList.remove('targeting_key', 'targeting_layer_key');
        if (status === LayerStatus.activeLayer) {
          button.classList.add('layer_key', 'pressed_layer_key');
          button.getElementsByClassName('layer_label')![0]!.textContent = 'LAYER'
        } else if (status === LayerStatus.inactiveLayer) {
          button.classList.add('layer_key')
          button.classList.remove('pressed_layer_key');
          button.getElementsByClassName('layer_label')![0]!.textContent = 'LAYER'
        } else {
          button.classList.remove('layer_key', 'pressed_layer_key');
          button.getElementsByClassName('layer_label')![0]!.textContent = ''
        }
      }
    }
  }

  private reRender() {
    const layout = this.layouts[this.editingLayout];
    if (!layout) {
      return;
    }
    try {
      this.updateLabel(layout.getLayer());
      this.updateJoystickModeValue(layout.getLayer().getJoystickMode());
    } catch (e) {
      console.error(e);
    }
    this.layoutLabel.textContent = "Layout " + this.editingLayout;
    this.updateHTMLClassName();
  }

  private updateLabel(layer: Layer): void {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        try {
          const key = layer.getKey({i, j});
          const row = this.buttons[i];
          if (!row) {
            continue;
          }
          const target = row[j];
          if (!target) {
            continue;
          }
          const keyLabel = target.getElementsByClassName('key_label')![0];
          if (keyLabel) {
            keyLabel.textContent = key
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  private updateJoystickModeValue(joystickMode: string): void {
    this.joystickModeSelector.value = joystickMode;
  }

  setKey(eventKey: string): void {
    if (this.targetingKey?.classList.contains('layer_key') && !this.targetingKey?.classList.contains('pressed_layer_key')) {
      return;
    }
    if (this.targetingKey) {
      const keyLabel = this.targetingKey.getElementsByClassName('key_label')[0];
      if (keyLabel) {
        keyLabel.textContent = eventKey;
      }
      if (this.targetingIndex) {
        this.layouts[this.editingLayout]?.setKey(eventKey, this.targetingIndex);
      }
    }
  }

  setJoystickMode(): void {
    const mode = this.joystickModeSelector.value;
    this.layouts[this.editingLayout]?.setJoystickMode(mode);
  }

  addLayer(): void {
    const layout = this.layouts[this.editingLayout];
    if (!this.targetingIndex || !layout || !this.targetingKey) {
      return;
    }
    layout.addLayer(this.targetingIndex);
    this.setKey('N/A');
    let layerLabel = this.targetingKey.getElementsByClassName('layer_label')[0];
    if (layerLabel) {
      layerLabel.textContent = 'LAYER';
    }
    this.targetingKey.classList.add('layer_key');
    this.targetingKey.click();
  }

  removeLayer(): void {
    const layout = this.layouts[this.editingLayout];
    if (this.targetingIndex) {
      layout?.removeLayer(this.targetingIndex);
    }
    if (this.targetingKey) {
      this.targetingKey.classList.remove('layer_key', 'pressed_layer_key', 'targeting_layer_key');
      let layerLabel = this.targetingKey.getElementsByClassName('layer_label')[0];
      if (layerLabel) {
        layerLabel.textContent = '';
      }
    }
    try {
      const layer = layout?.getLayer();
      if (layer) {
        this.updateLabel(layer);
      }
    } catch (e) {
      console.error(e);
    }
  }

  changeToNextLayout(): void {
    this.editingLayout++;
    this.editingLayout %= this.layouts.length;
    this.targetingKey = undefined;
    this.targetingIndex = undefined;
    this.reRender();
  }

  changeToPrevLayout(): void {
    this.editingLayout--;
    this.editingLayout += this.layouts.length;
    this.editingLayout %= this.layouts.length;
    this.targetingKey = undefined;
    this.targetingIndex = undefined;
    this.reRender();
  }

  addLayout(): void {
    this.layouts.push(new Layout(this.height, this.width));
    this.editingLayout = this.layouts.length - 1;
    this.targetingKey = undefined;
    this.targetingIndex = undefined;
    this.reRender();
  }

  removeLayout(): void {
    if (this.layouts.length < 2 || !confirm('Are you sure delete "Layout '+ this.editingLayout + '"?')) {
      return;
    }
    this.layouts.splice(this.editingLayout, 1);
    this.changeToNextLayout();
  }
  
  json(): string {
    return JSON.stringify(this);
  }

  loadJson(json: string): void {
    const obj = JSON.parse(json);
    if (obj.editingLayout) {
      this.editingLayout = obj.editingLayout
    }
    if (!obj.layouts) {
      throw new Error('failed load');
    }
    for (let i = 0; i < obj.layouts.length; i++) {
      if (this.layouts.length <= i)  {
        this.layouts[i] = new Layout(this.height, this.width);
      }
      this.layouts[i]?.loadFromObj(obj.layouts[i]);
    }
    this.reRender();
  }

  private download(data: string, filename: string) {
    const blobDate = new Blob([data]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blobDate);
    a.download = filename;
    a.click();
  }

  downloadJson(): void {
    this.download(this.json(), 'keymap.json');
  }

  getMaxlayerCount(): number {
    let maxLayerCount = 1;
    for (let i = 0; i < this.layouts.length; i++) {
      maxLayerCount = Math.max(maxLayerCount, this.layouts[i]!.getCountOfLayer());
    }
    return maxLayerCount;
  }

  private generateCustomSizeData(): string {
    let data: string = '';    
    data += '#ifndef DEFINE_CUSTOM_SIZE_H_\n';
    data += '#define DEFINE_CUSTOM_SIZE_H_\n';
    data += '\n';
    data += '#define NUMBER_OF_LAYER_SET ' + this.layouts.length + '\n';
    data += '#define NUMBER_OF_LAYER_SET ' + this.getMaxlayerCount() + '\n';
    data += '\n';
    data += '#endif  // DEFINE_CUSTOM_SIZE_H_\n';
    return data;
  }

  private generateCustomKeymapData(): string {
    let data: string = '';
    data += '#include <avr/pgmspace.h>\n'
    data += '#include "Layer.h"\n'
    data += '#include "define_custom_size.h"\n'
    data += '\n'
    data += 'const struct LayoutSet layout_set PROGMEM = {\n'
    data += '    NUMBER_OF_LAYER_SET,\n';
    for (let i = 0; i < this.layouts.length; i++) {
      const layoutKeymap = this.layouts[i]?.getKeymap();
      if (layoutKeymap) {
        data += layoutKeymap;
      }
    }
    data += '};\n'
    return data;
  }

  downloadCustomSize(): void {
    const customSizeData = this.generateCustomSizeData();
    this.download(customSizeData, 'define_custom_size.h');
  }

  downloadCustomKeymap(): void {
    const customKeymapData = this.generateCustomKeymapData();
    this.download(customKeymapData, 'define_custom_keymap.ino');
  }
}
