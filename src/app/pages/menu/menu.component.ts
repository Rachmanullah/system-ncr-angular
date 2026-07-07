import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "../../component/button/button";
import { InputComponent } from "../../component/inputCustom/input.component";
import { CircularProgressComponent } from "../../component/circularProgress/ciruclarProgress.component";
import { ModalComponent } from "../../component/modal/modal.component";
import { BreadCrumbComponent } from "../../component/breadcrumb/breadcrumb";
import { BUTTON_RADIUS, BUTTON_SIZES, BUTTON_VARIANTS } from "../../constant/button.constant";
import { ActivatedRoute } from "@angular/router";
import { MenuBase, MenuRequest } from "../../core/class/menu.class";
import { MenuService } from "../../service/menu.service";
import Swal from "sweetalert2";
import { SelectInputComponent } from "../../component/selectInput/selectInput";
import { selectInput } from "../../core/class/selectInput.class";
import { SearchInputComponent } from "../../component/searchInput/searchInput";
import { HasPermissionDirective } from "../../helper/permissionDirective";
import { SearchFilterPayload } from "../../core/class/searchFilterPayload.class";

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        InputComponent,
        CircularProgressComponent,
        ModalComponent,
        BreadCrumbComponent,
        SelectInputComponent,
        SearchInputComponent,
        HasPermissionDirective
    ],
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;
    private route = inject(ActivatedRoute);

    menus: MenuBase[] = [];
    filteredData: MenuBase[] = [];
    menuOptions: selectInput[] = [];
    selectedMenuId: number = 0;
    selectedMenu = signal<MenuRequest>({
        menuTitle: '',
        menuIcon: '',
        menuRoute: '',
        menuParentId: 0
    });

    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;
    showModal = false;
    isLoading = true;
    submitting = false;
    modalMode: 'add' | 'edit' = 'add';
    showErrors = signal(false);
    backendErrors = signal<Partial<Record<keyof MenuRequest, string>>>({});

    validationErrors = computed(() => {
        const menu = this.selectedMenu();
        const backend = this.backendErrors();

        return {
            menuTitle: backend.menuTitle || (!menu.menuTitle?.trim() ? 'Menu Title is required' : ''),
            menuIcon: backend.menuIcon || '',
            menuRoute: backend.menuRoute || '',
            menuParentId: backend.menuParentId || ''
        };
    });

    isFormValid = computed(() => {
        const errors = this.validationErrors();
        return Object.values(errors).every((error) => !error);
    });

    updateField<K extends keyof MenuRequest>(
        key: K,
        value: MenuRequest[K]
    ) {
        this.selectedMenu.update(menu => ({
            ...menu,
            [key]: value,
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    constructor(
        private menuService: MenuService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadMenuData();
    }

    loadMenuData() {
        this.route.data.subscribe((data) => {
            this.menus = data['menuData'];
            this.menuOptions = (data['menuData'] ?? []).map((x: any) => ({
                label: x.menuTitle,
                value: x.menuId
            }));
            this.isLoading = false;
            this.applyFilter('');
        });
    }

    fetchMenu() {
        this.menuService.getAllMenu().subscribe({
            next: (res) => {
                this.menus = res.data ?? [];
                this.isLoading = false;
                this.applyFilter('');
            },
            error: (err) => {
                console.log(err);
                this.isLoading = false;
            },
            complete: () => { this.cdr.detectChanges(); }
        });
    }

    applyFilter(filter?: SearchFilterPayload | string | null) {
        let searchText = '';

        if (typeof filter === 'string') {
            searchText = filter;
        } else {
            searchText = filter?.text ?? '';
        }
        const text = searchText.toLowerCase();
        this.filteredData = this.menus.filter(a =>
            (a.menuParentTitle ?? '').toLowerCase().includes(text) ||
            (a.menuRoute ?? '').toLowerCase().includes(text) ||
            (a.menuTitle ?? '').toLowerCase().includes(text)
        );
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    }

    get paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredData.slice(start, start + this.itemsPerPage);
    }

    changePage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
    }
    openAddModal() {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.modalMode = 'add';
        this.selectedMenu.set({
            menuTitle: '',
            menuIcon: '',
            menuRoute: '',
            menuParentId: 0
        });
        this.showModal = true;
    }

    openEditModal(menu: MenuBase) {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.selectedMenuId = menu.menuId;
        this.modalMode = 'edit';
        this.selectedMenu.set({
            menuTitle: menu.menuTitle,
            menuIcon: menu.menuIcon,
            menuRoute: menu.menuRoute,
            menuParentId: menu.menuParentId
        });
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveMenu() {
        this.showErrors.set(true);
        const payload = this.selectedMenu();
        console.log("payload : ", payload);

        if (!this.isFormValid()) {
            return;
        }
        if (this.modalMode === 'add') {
            console.log('ADD MENU');
            this.menuService.createMenu(payload).subscribe({
                next: (res) => {
                    console.log(res);
                    this.isLoading = false;
                    Swal.fire('Success', res.message, 'success');
                },
                error: (err) => {
                    this.isLoading = false;
                    const validation = err?.error?.message;
                    if (validation && typeof validation === 'object') {
                        this.backendErrors.set(validation);
                        this.showErrors.set(true);
                        return;
                    }
                    Swal.fire(
                        'Error',
                        err?.error?.message || 'Unknown Error',
                        'error'
                    );
                },
                complete: () => {
                    this.fetchMenu();
                    this.closeModal();
                }
            });
        } else {
            console.log('EDIT MENU');
            this.menuService.updateMenu(this.selectedMenuId, payload).subscribe({
                next: (res) => {
                    console.log(res);
                    this.isLoading = false;
                    Swal.fire('Success', res.message, 'success');
                },
                error: (err) => {
                    console.log(JSON.stringify(err.error.message));
                    this.isLoading = false;
                    const validation = err?.error?.message;
                    if (validation && typeof validation === 'object') {
                        this.backendErrors.set(validation);
                        this.showErrors.set(true);
                        return;
                    }
                    Swal.fire(
                        'Error',
                        err?.error?.message || 'Unknown Error',
                        'error'
                    );
                },
                complete: () => {
                    this.fetchMenu();
                    this.loadMenuData();
                    this.closeModal();
                }
            })
        }
    }

    deleteMenu(menuId: number) {
        this.showErrors.set(true);
        const payload = this.selectedMenu();
        console.log("payload : ", payload);
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete Menu ${payload.menuTitle} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('DELETE MENU');
                this.menuService.deleteMenu(menuId).subscribe({
                    next: (res) => {
                        console.log(res);
                        this.isLoading = false;
                        Swal.fire('Success', res.message, 'success');
                    },
                    error: (err) => {
                        console.log(err);
                        this.isLoading = false;
                        Swal.fire(
                            'Error',
                            err?.error?.message || 'Unknown Error',
                            'error'
                        );
                    },
                    complete: () => {
                        this.fetchMenu();
                        this.loadMenuData();
                    }
                })
            }
        })
    }
}