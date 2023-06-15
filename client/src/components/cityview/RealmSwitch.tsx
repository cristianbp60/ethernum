import clsx from 'clsx';
import React, { ComponentPropsWithRef, useEffect, useMemo, useState } from 'react';
import CircleButton from '../../elements/CircleButton';
import { OrderIcon } from '../../elements/OrderIcon';
import { Badge } from '../../elements/Badge';
import { RealmBadge } from '../../elements/RealmBadge';
import { Link } from 'wouter';

type RealmSwitchProps = {

} & ComponentPropsWithRef<'div'>

const dummyRealms = [
    {
        id: 1,
        name: 'Múklulik',
        order: 'brilliance',
    },
    {
        id: 2,
        name: 'Sitünti',
        order: 'enlightenment',
    },
    {
        id: 3,
        name: 'Änkum',
        order: 'fox',
    },
    {
        id: 4,
        name: 'nun-Nin',
        order: 'giants',
    },
    {
        id: 5,
        name: 'Künti',
        order: 'perfection',
    }
]

export const RealmSwitch = ({ className }: RealmSwitchProps) => {

    const [showRealms, setShowRealms] = useState(false);
    const [selectedRealm, setSelectedRealm] = useState(0);

    useEffect(() => { }, []);

    const bg = useMemo(() => {
        return `bg-order-${dummyRealms[selectedRealm].order}`
    }, [selectedRealm]);

    return (
        <div className={clsx('flex', className)}>
            { /* IDK why, but tailwind cant handle dynamic custom classes if they wasnt used before */}
            <div className='hidden bg-order-power bg-order-giants bg-order-titans bg-order-brilliance bg-order-skill bg-order-perfection bg-order-twins bg-order-reflection bg-order-detection bg-order-fox bg-order-vitriol bg-order-enlightenment bg-order-protection bg-order-fury bg-order-rage bg-order-anger fill-order-power fill-order-giants fill-order-titans fill-order-brilliance fill-order-skill fill-order-perfection fill-order-twins fill-order-reflection fill-order-detection fill-order-fox fill-order-vitriol fill-order-enlightenment fill-order-protection fill-order-fury fill-order-rage fill-order-anger stroke-order-power stroke-order-giants stroke-order-titans stroke-order-brilliance stroke-order-skill stroke-order-perfection stroke-order-twins stroke-order-reflection stroke-order-detection stroke-order-fox stroke-order-vitriol stroke-order-enlightenment stroke-order-protection stroke-order-fury stroke-order-rage stroke-order-anger'></div>
            <CircleButton className={`${bg} text-white`} size="md" onClick={() => setShowRealms(!showRealms)}>
                <OrderIcon order={dummyRealms[selectedRealm].order} size="xs" color='white' />
            </CircleButton>
            <div className={clsx('flex items-center ml-2 space-x-2 w-auto transition-all duration-300 overflow-hidden rounded-xl',
                showRealms ? 'max-w-[500px]' : 'max-w-0')
            }>
                {dummyRealms.map((realm, index) => (
                    <Link href='/realmView'>
                        <RealmBadge key={realm.id} realm={realm} active={selectedRealm === index} onClick={() => setSelectedRealm(index)} />
                    </Link>
                ))}
            </div>
            {!showRealms && <Badge size="lg" className='absolute top-0 right-0 translate-x-1 -translate-y-2 text-xxs text-brown'>
                {dummyRealms.length}
            </Badge>}
        </div>
    );
};