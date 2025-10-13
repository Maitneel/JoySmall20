interface Key {
  mouseEvent: string | null;
  keyEvent: string | null;
  layerEvent: string | null;
}

interface TwoDimIndex {
  i: number;
  j: number;
}

function newKey(mouseEvent: string | null = null, keyEvent: string | null = null, layerEvent: string | null = null): Key {
  const key: Key = { mouseEvent, keyEvent, layerEvent }
  return key;
};

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

  updateKey(key: string): void {
    // TODO
  }

  exportJson(): string {
    // TODO
    return 'some json string';
  }
}

class LayerSet {
  height: number;
  width: number;
  layer: Layer[] = [];
  editingLayer: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.layer[0] = new Layer(height, width);
    this.editingLayer = 0;
  }

  updateKey(key: string): void {
    // TODO
  }

  addLyaer(): void {
    // TODO
  }

  removeLayer(): void {
    // TODO
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
  editingLayerSet: number = 0;;
  layerSets: LayerSet[] = [];
  layerButtonCount: number = 0;

  constructor(buttons: HTMLElement[][]) {
    this.buttons = buttons;
    this.height = buttons.length;
    this.width = 0;
    this.editingLayerSet = 0;
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
    this.layerSets[0] = new LayerSet(this.height, this.width);
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
        // TODO switch layer
        this.targetingKey.classList.remove('pressed_layer_key');
      } else if (this.targetingKey.classList.contains('layer_key')) {
        // TODO switch layer
        this.targetingKey.classList.add('targeting_layer_key');
        this.targetingKey.classList.add('pressed_layer_key');
      }
    }
  }

  updateKey(key: string): void {
    if (this.targetingKey && !this.targetingKey?.classList.contains('layer_key')) {
      const keyLabel = this.targetingKey.getElementsByClassName('key_label')[0];
      if (keyLabel) {
        keyLabel.textContent = key;
      }
      this.layerSets[this.editingLayerSet]?.updateKey(key);
    }
  }

  addLayer(): void {

  }

  removeLayer(): void {

  }

  exportJson(): string {
    return 'some json string';
  }
}
