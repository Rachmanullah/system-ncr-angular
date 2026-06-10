import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from "@angular/core";
import { BUTTON_RADIUS, BUTTON_SIZES, BUTTON_VARIANTS } from "../../constant/button.constant";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "../../component/button/button";
import { InputComponent } from "../../component/inputCustom/input.component";
import { ModalComponent } from "../../component/modal/modal.component";
import { CircularProgressComponent } from "../../component/circularProgress/ciruclarProgress.component";
import { SelectInputComponent } from "../../component/selectInput/selectInput";
import { BreadCrumbComponent } from "../../component/breadcrumb/breadcrumb";
import { RoleMenuBase, RoleMenuRequest } from "../../core/class/roleMenu.class";
import { selectInput } from "../../core/class/selectInput.class";
import { RoleService } from "../../service/role.service";
import { RoleMenuService } from "../../service/rolemenu.service";
import { MenuService } from "../../service/menu.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-role',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        InputComponent,
        CircularProgressComponent,
        ModalComponent,
        SelectInputComponent,
        BreadCrumbComponent
    ],
    templateUrl: './rolemenu.component.html',
})

export class RoleMenuComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;
    private route = inject(ActivatedRoute);

    rolemenus: RoleMenuBase[] = [];
    roles: selectInput[] = [];
    menus: selectInput[] = [];
    selectedRoleMenuId: number = 0;
    selectedRoleMenu = signal<RoleMenuRequest>({
        roleId: 0,
        menuId: 0,
        status: 0
    });
    statusData: selectInput[] = [
        {
            label: 'Active',
            value: 0
        },
        {
            label: 'Non-Active',
            value: 1
        }
    ];
    showModal = false;
    isLoading = true;
    submitting = false;
    modalMode: 'add' | 'edit' = 'add';
    showErrors = signal(false);
    backendErrors = signal<Partial<Record<keyof RoleMenuRequest, string>>>({});

    validationErrors = computed(() => {
        const role = this.selectedRoleMenu();
        const backend = this.backendErrors();

        return {
            roleId: backend.roleId || (!role.roleId ? 'Role is required' : ''),
            menuId: backend.menuId || (!role.menuId ? 'Menu is required' : ''),
            status: backend.status || ''
        };
    });

    isFormValid = computed(() => {
        const errors = this.validationErrors();
        return Object.values(errors).every((error) => !error);
    });

    updateField<K extends keyof RoleMenuRequest>(
        key: K,
        value: RoleMenuRequest[K]
    ) {
        this.selectedRoleMenu.update(rolemenu => ({
            ...rolemenu,
            [key]: value,
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    constructor(
        private roleMenuService: RoleMenuService,
        private roleService: RoleService,
        private menuService: MenuService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            console.log(data);
            this.rolemenus = data['roleMenuData'];
            this.roles = (data['roleData'] ?? []).map((x: any) => ({
                label: x.roleName,
                value: x.roleId
            }));
            this.menus = (data['menuData'] ?? []).map((x: any) => ({
                label: x.menuTitle,
                value: x.menuId
            }));
            this.isLoading = false;
        })
    }

    fetchRoleMenu() {
        this.roleMenuService.getAllRoleMenu().subscribe({
            next: (res) => {
                this.rolemenus = res.data ?? [];
                this.isLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.isLoading = false;
            },
            complete: () => { this.cdr.detectChanges(); }
        });
    }

    openAddModal() {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.modalMode = 'add';
        this.selectedRoleMenu.set({
            roleId: 0,
            menuId: 0,
            status: 0
        });
        this.showModal = true;
    }

    openEditModal(rolemenu: RoleMenuBase) {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.selectedRoleMenuId = rolemenu.roleMenuId;
        this.modalMode = 'edit';
        this.selectedRoleMenu.set({
            roleId: rolemenu.roleId,
            menuId: rolemenu.menuId,
            status: rolemenu.status
        });
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveRoleMenu() {
        this.showErrors.set(true);
        const payload = this.selectedRoleMenu();
        console.log("payload : ", payload);

        if (!this.isFormValid()) {
            return;
        }
        if (this.modalMode === 'add') {
            console.log('ADD ROLEMENU');
            this.roleMenuService.createRoleMenu(payload).subscribe({
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
                    this.fetchRoleMenu();
                    this.closeModal();
                }
            });
        } else {
            console.log('EDIT ROLEMENU');
            this.roleMenuService.updateRoleMenu(this.selectedRoleMenuId, payload).subscribe({
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
                    this.fetchRoleMenu();
                    this.closeModal();
                }
            })
        }
    }

    deleteRoleMenu(roleMenuId: number) {
        this.showErrors.set(true);
        const payload = this.selectedRoleMenu();
        console.log("payload : ", payload);
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete Role Menu ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('DELETE ROLEMENU');
                this.roleMenuService.deleteRoleMenu(roleMenuId).subscribe({
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
                        this.fetchRoleMenu();
                    }
                })
            }
        })
    }
}