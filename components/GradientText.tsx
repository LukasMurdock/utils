import React from 'react';

type SpanTag = React.PropsWithoutRef<JSX.IntrinsicElements['span']>;

/**
 * Wrapper component for gradient text with Tailwind.
 */
export const GradientText: React.FC<SpanTag> = (props) => {
    const { className, children, ...spanProps } = props;
    return (
        <span
            {...spanProps}
            className={classNames(
                className ? className : '',
                'bg-gradient-to-br from-pink-400 to-red-600 bg-clip-text text-transparent'
            )}
        >
            {children}
        </span>
    );
};
