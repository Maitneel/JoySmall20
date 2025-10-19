import type { TwoDimIndex } from "./interface/Two-Dim-Index.js";
import { JoystickMode } from "./constants/Joystick-Mode.js";

export class Layer {
  private height: number;
  private width: number;
  private keymap: string[][];
  private joystickMode: string;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;

    this.keymap = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => 'N/A')
    );
    this.joystickMode = JoystickMode.cursor;
  }

  setKey(eventKey: string, index: TwoDimIndex): void {
    if (!this.keymap[index.i] || !this.keymap[index.i]![index.j]) {
      return;
    }
    this.keymap[index.i]![index.j]! = eventKey;
  }

  getKey(index: TwoDimIndex): string {
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

  loadFromObj(obj: {keymap: [][], joystickMode: string} ): void {
    for (let i = 0; i < this.height; i++) {
      if (!this.keymap[i] || !obj.keymap[i]) {
        continue;
      }
      for (let j = 0; j < this.width; j++) {
        if (!this.keymap[i]![j] || !obj.keymap[i]![j]) {
          continue;
        }
        this.keymap[i]![j]! = obj.keymap[i]![j]!
      }
    }
    this.joystickMode = obj.joystickMode;
  }
}

function isLayerEvent(event: string): boolean {
  // TODO
  return false;
}

function isMouseEvent(event: string): boolean {
  // TODO
  return false;
}
