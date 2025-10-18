import type { TwoDimIndex } from "./interface/Two-Dim-Index.js";
import type { Key } from "./interface/Key.js";
import { JoystickMode } from "./constants/Joystick-Mode.js";

export class Layer {
  private height: number;
  private width: number;
  private keymap: Key[][];
  private joystickMode: string;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;

    this.keymap = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => newKey())
    );
    this.joystickMode = JoystickMode.cursor;
  }

  setKey(eventKey: string, index: TwoDimIndex): void {
    if (this.keymap[index.i]) {
      const row = this.keymap[index.i];
      if (row !== undefined) {
        const key = row[index.j]
        if (key) {
          if (isLayerEvent(eventKey)) {
            key.keyEvent = eventKey;
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

  setJoystickMode(mode: string): void {
    if (mode !== JoystickMode.cursor && mode !== JoystickMode.wheel) {
      return;
    }
    this.joystickMode = mode;
  }

  getJoystickMode(): string {
    return this.joystickMode;
  }

  exportJson(): string {
    // TODO
    return 'some json string';
  }
}

function newKey(keyEvent: string | null = 'N/A', layerEvent: string | null = null): Key {
  const key: Key = { keyEvent, layerEvent }
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
