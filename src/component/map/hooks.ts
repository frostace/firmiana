import { useState, useEffect, useRef } from 'react';
import { Scene, PointLayer } from '@antv/l7';
import { ProvinceLayer } from '@antv/l7-district';
import { GaodeMap } from '@antv/l7-maps';
import AMapLoader from '@amap/amap-jsapi-loader';

import { addPointLayer, addProvinceLayer } from './util';
import estateService from '../../service/estate';

export const useInitMap = () => {
    const [loaded, setLoaded] = useState(false);
    const mapScene = useRef<Scene | null>(null);
    useEffect(() => {
        const initAMap = async () => {
            const AMap = await AMapLoader.load({
                key: '15cd8a57710d40c9b7c0e3cc120f1200', // 申请好的Web端开发者Key，首次调用 load 时必填
                version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            });
            const map = new AMap.Map('map', {
                viewMode: '3D',
                pitch: 0,
                mapStyle: 'amap://styles/darkblue',
                center: [121.435159, 31.256971],
                zoom: 14.89,
                zooms: [10, 100],
            });
            const scene = new Scene({
                id: 'map',
                map: new GaodeMap({
                    mapInstance: map,
                }),
                logoVisible: false,
            });

            mapScene.current = scene;
            setLoaded(true);
        };
        initAMap();
    }, []);

    return {
        loaded,
        mapScene,
    };
};

export const useInitLayers = (mapScene: React.RefObject<Scene>) => {
    const [loaded, setLoaded] = useState(false);
    const pointLayer = useRef<PointLayer>();
    const provinceLayer = useRef<ProvinceLayer>();

    useEffect(() => {
        const initLayers = async () => {
            const { data } = await estateService.getAllEstates();
            pointLayer.current = addPointLayer(mapScene.current!, data);
            provinceLayer.current = addProvinceLayer(mapScene.current!);
            setLoaded(true);
        };
        mapScene.current?.on('loaded', initLayers);
        return () => {
            mapScene.current?.off('loaded', initLayers);
        };
    });

    return { pointLayer, provinceLayer, layerLoaded: loaded };
};
