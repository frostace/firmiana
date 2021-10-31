import React, { FC } from 'react';
import { Button } from 'antd';

interface MenuConfig {
    name: string;
    onClick: (v?: any) => void;
    hidden?: boolean;
}

interface ContextMenuProps {
    left: number;
    top: number;
    show?: boolean;
    menuConfigs?: MenuConfig[];
}

const ContextMenu: FC<ContextMenuProps> = (props) => {
    const { left, top, show = false, children, menuConfigs = [] } = props;

    const menuItems = children ?? (
        <div style={{ backgroundColor: 'white' }}>
            {menuConfigs.map((menuConfig) => (
                <Button
                    type="text"
                    key={menuConfig.name}
                    onClick={menuConfig.onClick}
                    hidden={menuConfig?.hidden}
                >
                    {menuConfig.name}
                </Button>
            ))}
        </div>
    );

    return (
        <div
            style={{
                position: 'absolute',
                left,
                top,
                display: show ? 'block' : 'none',
                zIndex: 100,
            }}
        >
            {menuItems}
        </div>
    );
};

export default ContextMenu;
