import { ProvinceLayer } from '@antv/l7-district';
import { Scene, PointLayer } from '@antv/l7';

import { InfoDrawerField } from '../info-drawer';

export const addProvinceLayer = (scene: Scene) => {
    return new ProvinceLayer(scene, {
        joinBy: ['adcode', 'code'],
        adcode: ['310000'],
        depth: 3,
        label: {
            field: 'NAME_CHN',
            textAllowOverlap: false,
        },
        fill: {
            color: {
                field: 'pop',
                values: ['#B8E1FF', '#7DAAFF', '#3D76DD', '#0047A5', '#001D70'],
            },
        },
        popup: {
            enable: true,
            Html: (props) => {
                return `<span>${props.NAME_CHN}:</span><span>${props.pop}</span>`;
            },
        },
    });
};

export const addPointLayer = (scene: Scene, data: any): PointLayer => {
    try {
        scene.addImage(
            'marker',
            'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ'
        );
    } catch (e) {
        console.log('already registered marker icon');
    }
    const pointLayer = new PointLayer()
        .source(data, {
            parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude',
            },
        })
        .shape('marker')
        .size(12);
    pointLayer.select(true);

    scene.addLayer(pointLayer);

    return pointLayer as any;
};

export interface PlaceFeature {
    mode: 'create' | 'edit';
    id?: string;
    name?: string;
    longitude: number;
    latitude: number;
    unit_price?: number;
    count?: number;
    [other: string]: any;
}

export const formatFeatures = (features: PlaceFeature) => {
    // edge case
    if (!features) {
        return [];
    }
    return Object.entries(features).reduce((result, [field, value]) => {
        result.push({
            field,
            value,
        });
        return result;
    }, [] as InfoDrawerField[]);
};
