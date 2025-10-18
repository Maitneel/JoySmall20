import type { TwoDimIndex } from "./interface/Two-Dim-Index";
import type { Key } from "./interface/Key";

export class Layer {
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
