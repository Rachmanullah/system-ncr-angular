export interface MenuItem {
    menuId?: number;
    title: string;
    icon?: string;
    url?: string;
    children?: MenuItem[];
    open?: boolean;
    roles?: string[];
}

export interface MenuBase {
    menuId: number;
    menuTitle: string;
    menuIcon?: string | null;
    menuRoute?: string | null;
    menuParentId?: number | null;
    menuParentTitle?: string | null;
    menuParentIcon?: string | null;
}


export interface MenuRequest {
    menuTitle: string;
    menuIcon?: string | null;
    menuRoute?: string | null;
    menuParentId?: number | null;
}