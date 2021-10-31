import React, { FC, useEffect, useState } from 'react';
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import AMapLoader from '@amap/amap-jsapi-loader';

import { addPointLayer, addProvinceLayer } from './util';
import { ContextMenu } from '..';
import estateService from '../../service/estate';

const Map: FC = (props) => {
    const [leftTop, setLeftTop] = useState<number[]>([]);
    useEffect(() => {
        const initAMap = async () => {
            const AMap = await AMapLoader.load({
                key: '15cd8a57710d40c9b7c0e3cc120f1200', // 申请好的Web端开发者Key，首次调用 load 时必填
                version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
                // AMapUI: {
                //     // 是否加载 AMapUI，缺省不加载
                //     version: "1.1", // AMapUI 缺省 1.1
                //     plugins: [], // 需要加载的 AMapUI ui插件
                // },
                // Loca: {
                //     // 是否加载 Loca， 缺省不加载
                //     version: "1.3.2", // Loca 版本，缺省 1.3.2
                // },
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

            scene.on('loaded', async () => {
                const { data } = await estateService.getAllEstates();
                addPointLayer(scene, data);
                addProvinceLayer(scene);
            });
            scene.on('contextmenu', async (evt) => {
                setLeftTop([evt?.pixel?.x, evt?.pixel?.y]);
            });
            scene.on('click', (evt) => {
                setLeftTop([]);
            });
        };
        initAMap();
        return () => {
            // scene.off()
        };
    }, []);

    return (
        <>
            <div id="map"></div>
            <ContextMenu
                show={!!leftTop?.length}
                left={leftTop[0]}
                top={leftTop[1]}
                menuConfigs={[{ name: '新增', onClick: () => setLeftTop([]) }]}
            />
        </>
    );
};

export default Map;
