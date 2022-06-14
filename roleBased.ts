import { allTrue } from './allTrue';

/**
 * Example user with custom claims set from Firebase admin.
 */
type User = {
    customClaims: {
        admin?: boolean
    }
}

export type Roles = {
    admin: boolean | undefined;
}

export type Route = {
    name: string;
    description?: string;
    to: string;
    icon?: any;
    roles?: {
        admin?: boolean;
    };
};

export function roleBasedFilter(user: User, routes: Route[]) {
    return routes.reduce((prev: Route[], route: Route) => {
        if (!route.roles) {
            return [...prev, route];
        }

        if (
            allTrue(
                Object.entries(route.roles).map(([role, required]) => {
                    return required && !user
                        ? required && !user
                        : required &&
                              user &&
                              !user.customClaims[role as keyof Roles];
                })
            )
        ) {
            return [...prev];
        }

        return [...prev, route];
    }, []);
}

export function roleBasedMap(
    user: User | undefined,
    routes: Route[],
    f: (
        route: Route
    ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>
): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
    return routes.reduce<any>((prev: any, route: Route) => {
        // Allow route if no route is set
        if (!route.roles) {
            return [prev, f(route)];
        }
        // Check all route roles
        if (
            allTrue(
                Object.entries(route.roles).map(([role, required]) => {
                    return required && !user
                        ? required && !user
                        : required &&
                              user &&
                              !user.customClaims[role as keyof Roles];
                })
            )
        ) {
            return [prev];
        }
        return [prev, f(route)];
    }, null);
}
