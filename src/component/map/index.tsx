import React, { FC, useEffect, useState, useRef } from 'react';
import { PointLayer } from '@antv/l7-layers';

import { addPointLayer, addProvinceLayer, formatFeatures } from './util';
import { ContextMenu } from '..';
import estateService from '../../service/estate';
import { InfoDrawerTrigger } from '../info-drawer/trigger';
import { newEstateTemplate } from './constants';
import { useInitMap } from './hooks';
import { ClickPosition } from './interface';
import { MapTrigger } from './trigger';

const Map: FC = (props) => {
    const [clickPos, setClickPos] = useState<ClickPosition>({});
    const { mapScene, loaded } = useInitMap();
    const pointLayer = useRef<PointLayer>();
    useEffect(() => {
        // edge case:
        if (!loaded || !mapScene.current) {
            return;
        }
        const handleOnRefresh = async () => {
            const { data } = await estateService.getAllEstates();
            pointLayer.current?.setData(data);
        };
        const handleOnLoad = async () => {
            const { data } = await estateService.getAllEstates();
            pointLayer.current = addPointLayer(mapScene.current!, data);
            addProvinceLayer(mapScene.current!);
        };
        const handleOnRightClick = async (evt: any) => {
            setClickPos({
                left: evt?.pixel?.x,
                top: evt?.pixel?.y,
                longitude: evt?.lnglat?.lng,
                latitude: evt?.lnglat?.lat,
            });
        };
        const handleOnClick = () => {
            setClickPos({});
        };

        MapTrigger.on('REFRESH', handleOnRefresh);
        mapScene.current.on('loaded', handleOnLoad);
        mapScene.current.on('contextmenu', handleOnRightClick);
        mapScene.current.on('click', handleOnClick);
        return () => {
            MapTrigger.off('REFRESH', handleOnRefresh);
            mapScene.current?.off('loaded', handleOnLoad);
            mapScene.current?.off('contextmenu', handleOnRightClick);
            mapScene.current?.off('click', handleOnClick);
        };
    }, [loaded]);

    const handleCreateEstate = (params: any) => {
        InfoDrawerTrigger.emit('OPEN', {
            mode: 'create',
            data: formatFeatures(
                Object.assign(newEstateTemplate, {
                    longitude: clickPos?.longitude,
                    latitude: clickPos?.latitude,
                })
            ),
        });
        setClickPos({});
    };

    return (
        <>
            <div id="map"></div>
            <ContextMenu
                show={!!clickPos?.left}
                left={clickPos?.left!}
                top={clickPos?.top!}
                menuConfigs={[{ name: '新增', onClick: handleCreateEstate }]}
            />
        </>
    );
};

export default Map;
