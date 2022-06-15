/**
 * This component is helpful to automatically switch between
 * your Framework of choice’s <Link> component for internal links
 * and external links that open in a new page.
 */
import React from 'react';
import { ExternalLink } from './ExternalLink';
import { Link } from '@remix-run/react';

/** Use Framework Client-side Link tag. */
const InternalLink = ({
    href,
    className,
    children,
}: {
    href: string;
    className: string;
    children: React.ReactNode;
}) => {
    return (
        <Link to={href} className={className}>
            {children}
        </Link>
    );
};

export const LinkWrapper = ({
    href,
    className,
    children,
}: {
    href: string;
    className: string;
    children: React.ReactNode;
}) => {
    const isInternalLink = href[0] === '/';
    return isInternalLink ? (
        <InternalLink href={href} className={className}>
            {children}
        </InternalLink>
    ) : (
        <ExternalLink href={href} className={className}>
            {children}
        </ExternalLink>
    );
};
