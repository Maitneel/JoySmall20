import type { TwoDimIndex } from "./interface/Two-Dim-Index.js";
import { LayerStatus } from "./constants/Layer-Status.js";
import { Layer } from "./layer.js";

export class Layout {
  height: number;
  width: number;
  layer: { [key: string]: Layer } = {};
  layerStatus: string[];
  editingLayer: string;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.layerStatus = Array.from( {length: height * width}, () => LayerStatus.notLayer)
    this.editingLayer = this.getLayerName();
    this.layer[this.editingLayer] = new Layer(height, width);
  }

  private getLayerName(key: string[] = this.layerStatus): string {
    let layerName = '';
    for (let i = 0; i < key.length; i++) {
      if (key[i] === LayerStatus.activeLayer) {
        layerName += '1,';
      } else {
        layerName += '0,';
      }
    }
    return layerName;
  }

  setKey(eventKey: string, index: TwoDimIndex): void {
    this.layer[this.editingLayer]?.setKey(eventKey, index)
  }

  setJoystickMode(mode: string): void {
    this.layer[this.editingLayer]?.setJoystickMode(mode);
  }

  addLayer(target: TwoDimIndex): void {
    this.layerStatus[target.i * this.width + target.j] = LayerStatus.inactiveLayer;
    for (let layerDate in this.layer) {
      this.layer[layerDate]?.setKey('N/A', target);
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
    if (!this.layer.hasOwnProperty(this.editingLayer)) {
      this.layer[this.editingLayer] = new Layer(this.height, this.width);
    }
  }

  getLayer(): Layer{
    const layer = this.layer[this.editingLayer];
    if (!layer) {
      throw new Error('layer not found');
    }
    return layer;
  }

  getLayerStatus(): string[] {
    return this.layerStatus;
  }

  loadFromObj(obj: { edithingLayer: string, layer: { [key: string]: {keymap: [][], joystickMode: string} }, layerStatus: string[]}) {
    for (let property in obj.layer) {
      if (!this.layer.hasOwnProperty(property)) {
        this.layer[property] = new Layer(this.height, this.width);
      }
      this.layer[property]?.loadFromObj(obj.layer[property]!);
    }
    this.layerStatus = obj.layerStatus
  }

  private getCountOfLayer(): number {
    let layerKeyCount = 0;
    for (let i = 0; i < this.layerStatus.length; i++) {
      if (this.layerStatus[i] !== LayerStatus.notLayer) {
        layerKeyCount++;
      }
    }
    return Math.pow(2, layerKeyCount);
  }

  private getLayerData(): string {
    let key: string[] = this.layerStatus;
    for (let i = 0; i < key.length; i++) {
      if (key[i] === LayerStatus.activeLayer) {
        key[i] = LayerStatus.inactiveLayer;
      }
    }
    const defaultLayerKey = this.getLayerName(key);
    const defaultLayer = this.layer[defaultLayerKey]!;
    
    let data: string = '';
    const recursion = (index: number): void => {
      if (index === -1) {
        const keyString = this.getLayerName(key);
        let layer: Layer;
        if (this.layer.hasOwnProperty(keyString)) {
          layer = this.layer[keyString]!;
        } else {
          layer = defaultLayer;
        }
        data += layer.getKeymap();
        return;
      }
      if (key[index] === LayerStatus.activeLayer) {
        key[index] = LayerStatus.inactiveLayer;
      }
      recursion(index - 1);
      if (key[index] !== LayerStatus.notLayer) {
        key[index] = LayerStatus.activeLayer;
        recursion(index - 1);
        key[index] = LayerStatus.inactiveLayer;
      }
    }
    recursion(this.layerStatus.length - 1);
    return data;
  }

  getKeymap(): string {
    let data: string = '';

    data += '    {\n';
    data += '        {\n';
    data += '            ' + this.getCountOfLayer() +  ',\n';
    data += '            {\n';
    let layerIndex = 1;
    for (let i = 0; i < this.height; i++) {
      data += '                {';
      for (let j = 0; j < this.width; j++) {
        if (this.layerStatus[i * this.width + j] === LayerStatus.notLayer) {
          data += '0';
        } else {
          data += layerIndex;
          layerIndex = layerIndex << 1;
        }
        data += ', ';
      }
      data += '},\n';
    }
    data += '            },\n';
    data += '            {\n';
    data += this.getLayerData();
    data += '            }\n';
    data += '        }\n';
    data += '    }\n';
    return data;
  }
}
