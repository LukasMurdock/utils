type ATagProps = React.PropsWithoutRef<JSX.IntrinsicElements['a']>;

function getExternalLinkProps(props: ATagProps) {
    return {
        href: props.href,
        target: '_blank',
        rel: 'noreferrer noopener',
        ...props,
    };
}

export const ExternalLink: React.FC<ATagProps> = (props) => {
    const { children, ...rest } = props;
    return <a {...getExternalLinkProps(rest)}>{children}</a>;
};
