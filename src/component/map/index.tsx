import React, { FC, useEffect, useState } from 'react';

import { addPointLayer, addProvinceLayer, formatFeatures } from './util';
import { ContextMenu } from '..';
import estateService from '../../service/estate';
import { InfoDrawerTrigger } from '../info-drawer/trigger';
import { newEstateTemplate } from './constants';
import { useInitMap } from './hooks';

const Map: FC = (props) => {
    const [leftTop, setLeftTop] = useState<number[]>([]);
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
            setLeftTop([evt?.pixel?.x, evt?.pixel?.y]);
        };
        const handleOnClick = () => {
            setLeftTop([]);
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

    const handleCreateEstate = () => {
        InfoDrawerTrigger.emit('OPEN', {
            mode: 'create',
            data: formatFeatures(newEstateTemplate),
        });
        setLeftTop([]);
    };

    return (
        <>
            <div id="map"></div>
            <ContextMenu
                show={!!leftTop?.length}
                left={leftTop[0]}
                top={leftTop[1]}
                menuConfigs={[{ name: '新增', onClick: handleCreateEstate }]}
            />
        </>
    );
};

export default Map;
