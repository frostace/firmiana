import React, { FC, useEffect, useState } from 'react';

import { formatFeatures } from './util';
import { ContextMenu } from '..';
import estateService from '../../service/estate';
import { InfoDrawerTrigger } from '../info-drawer/trigger';
import { newEstateTemplate } from './constants';
import { useInitLayers, useInitMap } from './hooks';
import { ClickPosition } from './interface';
import { MapTrigger } from './trigger';

const Map: FC = (props) => {
    const [clickPos, setClickPos] = useState<ClickPosition>({});
    const { mapScene, loaded } = useInitMap();
    const { pointLayer, layerLoaded } = useInitLayers(mapScene);

    useEffect(() => {
        // edge case:
        if (!loaded || !layerLoaded || !mapScene.current) {
            return;
        }
        const handleOnRefresh = async () => {
            const { data } = await estateService.getAllEstates();
            pointLayer.current?.setData(data);
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
        const handleOnClickMarker = async (e: any) => {
            const { data: thisEstateFeatures } =
                await estateService.getSingleEstate({
                    id: e?.feature?.id,
                });
            InfoDrawerTrigger.emit('OPEN', {
                mode: 'edit',
                data: formatFeatures(thisEstateFeatures as any),
            });
        };
        const handleOnRightClickMarker = async (e: any) => {};

        MapTrigger.on('REFRESH', handleOnRefresh);
        pointLayer.current?.on('contextmenu', handleOnRightClickMarker);
        pointLayer.current?.on('click', handleOnClickMarker);
        mapScene.current.on('contextmenu', handleOnRightClick);
        mapScene.current.on('click', handleOnClick);
        return () => {
            MapTrigger.off('REFRESH', handleOnRefresh);
            pointLayer.current?.off('contextmenu', handleOnRightClickMarker);
            pointLayer.current?.off('click', handleOnClickMarker);
            mapScene.current?.off('contextmenu', handleOnRightClick);
            mapScene.current?.off('click', handleOnClick);
        };
    }, [loaded, layerLoaded]);

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
    const handleDeleteEstate = (params: any) => {
        console.log(params);
        // await estateService.deleteSingleEstate({
        //     id: e?.feature?.id,
        // });
    };

    return (
        <>
            <div id="map"></div>
            <ContextMenu
                show={!!clickPos?.left}
                left={clickPos?.left!}
                top={clickPos?.top!}
                menuConfigs={[
                    { name: '新增', onClick: handleCreateEstate },
                    { name: '删除', onClick: handleDeleteEstate },
                ]}
            />
        </>
    );
};

export default Map;
