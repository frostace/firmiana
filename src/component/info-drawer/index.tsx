import React, { FC, useEffect, useState } from 'react';
import { Drawer, Form, Button } from 'antd';
import { omit } from 'lodash-es';

import { InfoDrawerTrigger } from './trigger';
import { XComponent } from '../index';
import estateService from '../../service/estate';
import { getInitialValues } from './util';
import { featureFieldBlackList } from '../../constants';

import './index.css';

export interface InfoDrawerField {
    field: string;
    value: any;
    [other: string]: any;
}

const InfoDrawer: FC = (props) => {
    const [drawerData, setDrawerData] = useState<InfoDrawerField[] | null>(
        null
    );
    const [form] = Form.useForm();

    const handleOpen = (payload?: { data: InfoDrawerField[] }) => {
        const initialValue = getInitialValues(payload?.data);
        form.setFieldsValue(initialValue);
        setDrawerData(payload?.data ?? null);
    };

    const handleClose = () => {
        setDrawerData(null);
    };

    useEffect(() => {
        InfoDrawerTrigger.on('OPEN', handleOpen);
        InfoDrawerTrigger.on('CLOSE', handleClose);
        return () => {
            InfoDrawerTrigger.off('OPEN', handleOpen);
            InfoDrawerTrigger.off('CLOSE', handleClose);
        };
    }, []);

    return (
        <Drawer visible={!!drawerData} width={600} onClose={handleClose}>
            <Form
                form={form}
                name="info"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
            >
                {(drawerData ?? []).map((field) => {
                    return (
                        <Form.Item
                            key={field.field}
                            name={field.field}
                            label={field.field}
                            hidden={featureFieldBlackList.includes(field.field)}
                        >
                            <XComponent />
                        </Form.Item>
                    );
                })}
            </Form>
            <Button
                onClick={async () => {
                    const formData = form.getFieldsValue();
                    if (formData?.mode === 'create') {
                        await estateService.postCreateNewEstate(
                            omit(formData, ['mode', 'id'])
                        );
                    } else {
                        await estateService.putEditEstate(formData);
                    }
                    InfoDrawerTrigger.emit('CLOSE');
                }}
            >
                确定
            </Button>
        </Drawer>
    );
};

export default InfoDrawer;
