import type { TwoDimIndex } from "./interface/Two-Dim-Index.js";
import { LayerStatus } from "./constants/Layer-Status.js";
import { Layer } from "./layer.js";

export class Layout {
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

  setKey(eventKey: string, index: TwoDimIndex): void {
    this.layer.get(this.editingLayer)?.setKey(eventKey, index)
  }

  setJoystickMode(mode: string): void {
    this.layer.get(this.editingLayer)?.setJoystickMode(mode);
  }

  addLayer(target: TwoDimIndex): void {
    this.layerStatus[target.i * this.width + target.j] = LayerStatus.inactiveLayer;
    for (let [layerName, layerDate] of this.layer) {
      layerDate.setKey('N/A', target);
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

  getLayerStatus(): string[] {
    return this.layerStatus;
  }

  exportJson(): string {
    // TODO
    return 'some json string';
  }
}
