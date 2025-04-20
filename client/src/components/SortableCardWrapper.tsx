import { ReactNode } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableCardWrapperProps {
    id: string;
    children: (props: {
        listeners: ReturnType<typeof useSortable['listeners']>;
    }) => ReactNode;
}

export const SortableCardWrapper = (props: SortableCardWrapperProps) => {
    const {
        id,
        children,
    } = props;
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            {...attributes}
        >
            {
                typeof children === 'function'
                    ? children({ listeners })
                    :children
            }
        </div>
    );
};