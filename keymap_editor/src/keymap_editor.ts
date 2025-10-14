interface Key {
  mouseEvent: string | null;
  keyEvent: string | null;
  layerEvent: string | null;
}

const LayerStatus = {
  notLayer: '0',
  inactiveLayer: '1',
  activeLayer: '2',
};

interface TwoDimIndex {
  i: number;
  j: number;
}

function newKey(mouseEvent: string | null = null, keyEvent: string | null = 'N/A', layerEvent: string | null = null): Key {
  const key: Key = { mouseEvent, keyEvent, layerEvent }
  return key;
};

function isLayerEvent(event: string): boolean {
  // TODO
  return false;
}

function isMouseEvent(event: string): boolean {
  // TODO
  return false;
}

class Layer {
  private height: number;
  private width: number;
  private keymap: Key[][];

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;

    this.keymap = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => newKey())
    );
  }

  updateKey(eventKey: string, index: TwoDimIndex): void {
    if (this.keymap[index.i]) {
      const row = this.keymap[index.i];
      if (row !== undefined) {
        const key = row[index.j]
        if (key) {
          if (isLayerEvent(eventKey)) {
            key.keyEvent = eventKey;
          } else if (isMouseEvent(eventKey)) {
            key.mouseEvent = eventKey;  
          } else {
            key.keyEvent = eventKey;
          }
        }
      }
    }
  }

  getKey(index: TwoDimIndex): Key {
    const row = this.keymap[index.i];
    if (!row) {
      throw new Error('out of range i: ' + index.i);
    }
    const key = row[index.j];
    if (!key) {
      throw new Error('out of range j: ' + index.j);
    }
    return key;
  }

  exportJson(): string {
    // TODO
    return 'some json string';
  }
}

class Layout {
  height: number;
  width: number;
  layer: Map<string, Layer>;
  layerStatus: string[];
  editingLayer: string;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.layerStatus = Array.from( {length: height * width}, () => LayerStatus.notLayer)
    this.layer = new Map<string, Layer>();
    this.editingLayer = this.getLayerName();
    this.layer.set(this.editingLayer, new Layer(height, width));
  }

  private getLayerName(): string {
    let layerName = '';
    for (let i = 0; i < this.layerStatus.length; i++) {
      if (this.layerStatus[i] === LayerStatus.activeLayer) {
        layerName += '1,';
      } else {
        layerName += '0,';
      }
    }
    return layerName;
  }

  updateKey(eventKey: string, index: TwoDimIndex): void {
    this.layer.get(this.editingLayer)?.updateKey(eventKey, index)
  }

  addLayer(target: TwoDimIndex): void {
    this.layerStatus[target.i * this.width + target.j] = LayerStatus.inactiveLayer;
    for (let [layerName, layerDate] of this.layer) {
      layerDate.updateKey('N/A', target);
    }
  }

  removeLayer(target: TwoDimIndex): void {
    const targetIndex = target.i * this.width + target.j;
    this.layerStatus[targetIndex] = LayerStatus.notLayer;
    this.editingLayer = this.getLayerName();
  }

  switchLayer(switchKey: TwoDimIndex): void {
    let target = this.layerStatus[switchKey.i * this.width + switchKey.j];
    if (target === LayerStatus.inactiveLayer) {
      this.layerStatus[switchKey.i * this.width + switchKey.j] = LayerStatus.activeLayer;
    } else if (target === LayerStatus.activeLayer) {
      this.layerStatus[switchKey.i * this.width + switchKey.j] = LayerStatus.inactiveLayer;
    }
    this.editingLayer = this.getLayerName();
    if (!this.layer.has(this.editingLayer)) {
      this.layer.set(this.editingLayer, new Layer(this.height, this.width));
    }
  }

  getLayer(): Layer{
    const layer = this.layer.get(this.editingLayer);
    if (!layer) {
      throw new Error('layer not found');
    }
    return layer;
  }

  exportJson(): string {
    // TODO
    return 'some json string';
  }
}

export class KeyMapEditor {
  height: number;
  width: number;
  buttons: HTMLElement[][];
  targetingKey: HTMLElement | undefined = undefined;
  targetingIndex: TwoDimIndex | undefined;
  editingLayout: number = 0;;
  layouts: Layout[] = [];
  layerButtonCount: number = 0;

  constructor(buttons: HTMLElement[][]) {
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
    try {
      this.updateLabel(layout.getLayer());
    } catch (e) {
      console.error(e);
    }
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
            keyLabel.textContent = key.keyEvent
          }
          // TODO??
          //const mouseLabel = target.getElementsByClassName('mouse_label')![0];
          //if (mouseLabel) {
          //  mouseLabel.textContent = key.mouseEvent
          //}
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  updateKey(eventKey: string): void {
    if (this.targetingKey?.classList.contains('layer_key') && !this.targetingKey?.classList.contains('pressed_layer_key')) {
      return;
    }
    if (this.targetingKey) {
      const keyLabel = this.targetingKey.getElementsByClassName('key_label')[0];
      if (keyLabel) {
        keyLabel.textContent = eventKey;
      }
      if (this.targetingIndex) {
        this.layouts[this.editingLayout]?.updateKey(eventKey, this.targetingIndex);
      }
    }
  }

  addLayer(): void {
    const layout = this.layouts[this.editingLayout];
    if (!this.targetingIndex || !layout || !this.targetingKey) {
      return;
    }
    layout.addLayer(this.targetingIndex);
    this.updateKey('N/A');
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

  exportJson(): string {
    return 'some json string';
  }
}
