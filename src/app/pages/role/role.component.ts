import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "../../component/button/button";
import { InputComponent } from "../../component/inputCustom/input.component";
import { CircularProgressComponent } from "../../component/circularProgress/ciruclarProgress.component";
import { ModalComponent } from "../../component/modal/modal.component";
import { SelectInputComponent } from "../../component/selectInput/selectInput";
import { BreadCrumbComponent } from "../../component/breadcrumb/breadcrumb";
import { BUTTON_RADIUS, BUTTON_SIZES, BUTTON_VARIANTS } from "../../constant/button.constant";
import { RoleBase, RoleRequest } from "../../core/class/role.class";
import { ActivatedRoute } from "@angular/router";
import { RoleService } from "../../service/role.service";
import Swal from "sweetalert2";
import { selectInput } from "../../core/class/selectInput.class";
import { CheckboxComponent } from "../../component/checkbox/checkbox.component";
import { PERMISSION } from "../../constant/permission.constant";
import { checkboxOption } from "../../core/class/checkbox.class";
import { RolePermissionRequest } from "../../core/class/rolePermission.class";
import { AuthService } from "../../service/auth.service";
import { AuthBase } from "../../core/class/auth.class";
import { SearchInputComponent } from "../../component/searchInput/searchInput";
import { HasPermissionDirective } from "../../helper/permissionDirective";
import { SearchFilterPayload } from "../../core/class/searchFilterPayload.class";

enum FormMode {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE'
};

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
        BreadCrumbComponent,
        CheckboxComponent,
        SearchInputComponent,
        HasPermissionDirective,
    ],
    templateUrl: './role.component.html',
})

export class RoleComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;
    protected readonly FormMode = FormMode;

    formMode = signal<FormMode>(FormMode.CREATE);
    permissions: checkboxOption[] = [];
    permissionColumns: checkboxOption[][] = [];
    selectedPermissions: number[] = [];

    private route = inject(ActivatedRoute);
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;

    roles: RoleBase[] = [];
    filteredData: RoleBase[]=[];
    selectedRoleId: number = 0;
    selectedRole = signal<RoleRequest>({
        roleName: '',
        status: 0,
        rolePermission: []
    });
    user: AuthBase = {
        userId: 0,
        fullname: '',
        position: '',
        departmentId: 0,
        departmentName: '',
        roleName: ''
    };
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

    isLoading = true;
    submitting = false;
    showErrors = signal(false);
    backendErrors = signal<Partial<Record<keyof RoleRequest, string>>>({});

    validationErrors = computed(() => {
        const role = this.selectedRole();
        const backend = this.backendErrors();
        return {
            roleName:
                backend.roleName ||
                (!role.roleName.trim()
                    ? 'Role Name Required'
                    : ''),
            status:
                backend.status || '',
            permissions:
                this.selectedPermissions.length === 0
                    ? 'Select at least one permission'
                    : ''
        };
    });

    isFormValid = computed(() => {
        const errors = this.validationErrors();
        return Object.values(errors).every((error) => !error);
    });
    updateField<K extends keyof RoleRequest>(
        key: K,
        value: RoleRequest[K]
    ) {
        this.selectedRole.update(role => ({
            ...role,
            [key]: value,
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    constructor(
        private roleService: RoleService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
        this.route.data.subscribe((data) => {
            console.log(data);
            this.roles = data['roleData'];
            this.permissions = (data['permissionData'] ?? []).map((res: any) => ({
                label: res.permissionCode,
                value: res.permissionId
            }));
            this.buildPermissionColumns();
            this.isLoading = false;
            this.applyFilter('');
        })
    }

    fetchRole() {
        this.roleService.getAllRole().subscribe({
            next: (res) => {
                this.roles = res.data ?? [];
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
        this.filteredData = this.roles.filter(a =>
            (a.roleName ?? '').toLowerCase().includes(text)
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


    noWritePermission = computed(() => {
        const noWritePermission = this.formMode() === FormMode.CREATE
            ? !this.authService.hasPermission('CREATE_ROLE')
            : !this.authService.hasPermission('UPDATE_ROLE');

        return noWritePermission;
    });
    private buildPermissionColumns() {
        const columnCount = 3;
        const perColumn = Math.ceil(this.permissions.length / columnCount);

        this.permissionColumns = [];

        for (let i = 0; i < columnCount; i++) {
            this.permissionColumns.push(
                this.permissions.slice(
                    i * perColumn,
                    (i + 1) * perColumn
                )
            );
        }
    }

    private buildRolePermission(): RolePermissionRequest[] {
        return this.permissions.sort((a, b) => Number(a.value) - Number(b.value)).map(permission => {
            const existing =
                this.selectedRole()
                    .rolePermission
                    ?.find(x => x.permissionId === permission.value);
            return {
                rolePermissionId: existing?.rolePermissionId ?? 0,
                roleId: this.selectedRoleId,
                permissionId: Number(permission.value),
                permissionCode: permission.label,
                status:
                    this.selectedPermissions.includes(Number(permission.value))
                        ? 0
                        : 1
            };
        });
    }

    editRole(role: RoleBase) {

        this.selectedRoleId = role.roleId;

        this.selectedRole.set({
            roleName: role.roleName,
            status: role.status,
            rolePermission: role.rolePermission
        });
        this.selectedPermissions =
            role.rolePermission
                .filter(p => p.status === 0)
                .map(p => p.permissionId);

        this.backendErrors.set({});

        this.showErrors.set(false);

        this.formMode.set(FormMode.UPDATE);
        this.formMode.set(FormMode.UPDATE);

    }

    resetForm() {
        this.selectedRoleId = 0;
        this.selectedPermissions = [];
        this.selectedRole.set({
            roleName: '',
            status: 0,
            rolePermission: []
        });
        this.backendErrors.set({});
        this.showErrors.set(false);
        this.formMode.set(FormMode.CREATE);
    }

    saveRole() {

        this.showErrors.set(true);

        if (!this.isFormValid()) {
            return;
        }

        this.isLoading = true;

        const payload: RoleRequest = {
            ...this.selectedRole(),
            rolePermission: this.buildRolePermission()
        };

        const request$ =
            this.formMode() === FormMode.CREATE
                ? this.roleService.createRole(payload)
                : this.roleService.updateRole(
                    this.selectedRoleId,
                    payload
                );

        request$.subscribe({

            next: (res) => {

                this.isLoading = false;

                Swal.fire(
                    'Success',
                    res.message,
                    'success'
                );

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

                this.fetchRole();

                this.resetForm();

                this.cdr.detectChanges();

            }

        });

    }

    deleteRole(role: RoleBase) {
        this.showErrors.set(true);
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete Role ${role.roleName} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('DELETE ROLE');
                this.roleService.deleteRole(role.roleId).subscribe({
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
                        this.fetchRole();
                    }
                })
            }
        })
    }
}