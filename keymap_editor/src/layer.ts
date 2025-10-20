import type { TwoDimIndex } from "./interface/Two-Dim-Index.js";
import { JoystickMode } from "./constants/Joystick-Mode.js";
import { convertKeycode } from "./keycode_converter.js";

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

  loadFromObj(obj: { keymap: [][], joystickMode: string }): void {
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

  getMouseKeymap(): string {
    let data: string = '';
    data += '                    {\n';
    for (let i = 0; i < this.height; i++) {
      data += '                        {';
      for (let j = 0; j < this.width; j++) {
        if (this.keymap[i] === undefined || this.keymap[i]![j] === undefined) {
          data += 'UNDEFINED_KEY';
        } else {
          data += convertKeycode(this.keymap[i]![j]!, true);
        }
        data += ', ';
      }
      data += '},\n';
    }
    data += '                    },\n';
    return data;
  }
  
  getKeyKeymap(): string {
    let data: string = '';
    data += '                    {\n';
    for (let i = 0; i < this.height; i++) {
      data += '                        {';
      for (let j = 0; j < this.width; j++) {
        if (this.keymap[i] === undefined || this.keymap[i]![j] === undefined) {
          data += 'UNDEFINED_KEY';
        } else {
          data += convertKeycode(this.keymap[i]![j]!, false);
        }
        data += ', ';
      }
      data += '},\n';
    }
    data += '                    },\n';
    return data;
  }

  getJoystickSetting(): string {
    let data: string = '';
    data += '                    {'
    if (this.joystickMode === 'wheel') {
      data += 'true, ';
    } else {
      data += 'false, ';
    }
    data += 'UNDEFINED_KEY, '; // joystick mouse;
    data += 'UNDEFINED_KEY, '; // joystick key;
    data += '},\n';
    return data;
  }

  getRotaryEncoderSetting(): string {
    let data: string = '';
    data += '                    UNDEFINED_KEY,\n'; // rotary encoder mouse;
    data += '                    UNDEFINED_KEY,\n'; // rotary encoder key;
    return data;
  }

  getKeymap(): string {
    let data: string = '';
    data += '                {\n';
    data += this.getMouseKeymap();
    data += this.getKeyKeymap();
    data += this.getJoystickSetting();
    data += this.getRotaryEncoderSetting();
    data += '                },\n'
    return data;
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
