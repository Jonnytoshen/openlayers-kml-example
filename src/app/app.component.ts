import { Component, OnInit, ElementRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { fromLonLat } from 'ol/proj';
import { DragAndDrop } from 'ol/interaction';
import { KML, GeoJSON } from 'ol/format';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point, LineString, Polygon } from 'ol/geom';
import { Style, Fill, Stroke, Icon, Text, Circle } from 'ol/style';
import Map from 'ol/Map';
import View from 'ol/View';

import { getFeatureStyle } from './utils';
import { StyleViewComponent } from './components/style-view';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  layers: Array<VectorLayer> = [];
  dataLayer: VectorLayer;
  private map: Map;
  
  constructor(
    protected elementRef: ElementRef,
    protected modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.createMap();
    this.createDragAndDropInteraction();
    this.addLayer();
  }

  showLayerStyle(layer: VectorLayer): void {
    const features = layer.getSource().getFeatures();
    const data = features.reduce((result, feature) => {
      return {
        ...result,
        [feature.get('name')]: feature.get('style_')
      };
    }, {});
    this.modalService.create({
      nzTitle: '图层样式',
      nzContent: StyleViewComponent,
      nzComponentParams: { data: JSON.parse(JSON.stringify(data)) },
      nzFooter: null
    });
  }

  exportLayer(layer: VectorLayer): void {
    const format = new KML();
    const features = layer.getSource().getFeatures();
    const dataProjection = 'EPSG:4326';
    const featureProjection = 'EPSG:3857';
    const xmlData = format.writeFeatures(features, { dataProjection, featureProjection });
    // const xmlString = new XMLSerializer().serializeToString(xmlData);
    const xmlDataBlob = new Blob([xmlData], { type : 'application/xml' });
    const filename = layer.get('name') ? `download-${layer.get('name')}` : `download-${new Date().valueOf()}.kml`;
    const blobURL = window.URL.createObjectURL(xmlDataBlob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobURL;
      tempLink.setAttribute('download', filename);
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
      }
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
      }, 100);
  }

  removeLayer(layer: VectorLayer): void {
    this.map.removeLayer(layer);
  }

  flyToDataLayer(): void {
    const extent = this.dataLayer.getSource().getExtent();
    this.map.getView().fit(extent, {
      padding: [100, 100, 100, 100],
      duration: 1000
    })
  }

  private createMap(): void {
    const element = this.elementRef.nativeElement.querySelector('.app-map-view');
    this.map = new Map({
      view: new View({
        center: fromLonLat([104.06455993652344, 30.660359565846754]),
        zoom: 8
      }),
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      target: element
    });
    this.map.getLayers().on('change:length', () => {
      this.layers = this.map.getLayers()
        .getArray()
        .filter(layer => layer instanceof VectorLayer && layer.get('name'));
    });
  }

  private createDragAndDropInteraction(): void {
    const dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [ KML ]
    });
    const resolution = this.map.getView().getResolution();
    dragAndDropInteraction.on('addfeatures', ({ features, file }) => {

      features.forEach(feature => {
        feature.set('style_', getFeatureStyle(feature, resolution));
      });

      const name = file['name'];
      const source = new VectorSource({ features });
      const vectorLayer = new VectorLayer({ source });
      vectorLayer.set('name', name);
      this.map.addLayer(vectorLayer);
      this.map.getView().fit(source.getExtent(), { 
        padding: [50, 50, 50, 50],
        duration: 1000
      });
    });
    this.map.addInteraction(dragAndDropInteraction);
  }

  private addLayer(): void {
    this.dataLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: '/assets/data.geojson'
      }),
      style: (feature) => {
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          const style = new Style({
            image: new Icon({
              src: 'http://new-energy.pengfei.geoshare.cn/assets/projects-icons/38-166-154-l-rocket.png'
            }),
            text: new Text({
              text: feature.get('name'),
              offsetY: 15,
              font: '14px sans-serif',
              stroke: new Stroke({ color: [255, 255, 255, 1], width: 4 }),
              fill: new Fill({color: [251, 192, 45, 1]}),
              overflow: true
            })
          });
          feature.setStyle(style);
        } else if (geometry instanceof LineString) {
          const style = new Style({
            stroke: new Stroke({
              width: 10,
              color: '#9254de',
              lineDash: [5, 20]
            })
          });
          feature.setStyle(style);
        } else if (geometry instanceof Polygon) {
          const style = new Style({
            fill: new Fill({ color: [255, 255, 255, .5]}),
            stroke: new Stroke({
              width: 5,
              color: '#f759ab'
            })
          });
          feature.setStyle(style);
        }
      }
    });
    this.map.addLayer(this.dataLayer);
  }
}
