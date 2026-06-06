export interface MenuItem {
    menuId?: number;
    title: string;
    icon?: string;
    url?: string;
    children?: MenuItem[];
    badge?: string;
    open?: boolean;
    roles?: string[];
}

export interface MenuBase {
    parentMenu?: string | null;
    parentIcon?: string | null;
    childMenu?: string | null;
    childIcon?: string | null;
    route?: string | null;
    deleted?: number | null;
}

export interface MenuData {
    menuId : number;
    title?: string | null;
    icon?: string | null;
    route?: string | null;
    parentId?: number | null;
    parentTitle?: string | null;
}

export interface MenuRequest {
    title?: string | null;
    icon?: string | null;
    route?: string | null;
    parentId?: number | null;
}