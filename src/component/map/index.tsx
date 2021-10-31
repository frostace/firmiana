import React, { FC, useEffect, useState } from 'react';

import { addPointLayer, addProvinceLayer, formatFeatures } from './util';
import { ContextMenu } from '..';
import estateService from '../../service/estate';
import { InfoDrawerTrigger } from '../info-drawer/trigger';
import { newEstateTemplate } from './constants';
import { useInitMap } from './hooks';
import { ClickPosition } from './interface';

const Map: FC = (props) => {
    const [clickPos, setClickPos] = useState<ClickPosition>({});
    const { mapScene, loaded } = useInitMap();
    useEffect(() => {
        // edge case:
        if (!loaded || !mapScene.current) {
            return;
        }
        const handleOnLoad = async () => {
            const { data } = await estateService.getAllEstates();
            addPointLayer(mapScene.current!, data);
            addProvinceLayer(mapScene.current!);
        };
        const handleOnRightClick = async (evt: any) => {
            console.log(evt);
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

        mapScene.current.on('loaded', handleOnLoad);
        mapScene.current.on('contextmenu', handleOnRightClick);
        mapScene.current.on('click', handleOnClick);
        return () => {
            mapScene.current?.off('loaded', handleOnLoad);
            mapScene.current?.off('contextmenu', handleOnRightClick);
            mapScene.current?.off('click', handleOnClick);
        };
    }, [loaded]);

    const handleCreateEstate = (params: any) => {
        console.log(params);
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
