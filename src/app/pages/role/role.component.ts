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
    templateUrl: './role.component.html',
})

export class RoleComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;
    private route = inject(ActivatedRoute);

    roles: RoleBase[] = [];
    selectedRoleId: number = 0;
    selectedRole = signal<RoleRequest>({
        roleName: '',
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
    backendErrors = signal<Partial<Record<keyof RoleRequest, string>>>({});

    validationErrors = computed(() => {
        const role = this.selectedRole();
        const backend = this.backendErrors();

        return {
            roleName: backend.roleName || (!role.roleName?.trim() ? 'Role Name is required' : ''),
            status: backend.status || ''
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
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            console.log(data);
            this.roles = data['roleData'];
            this.isLoading = false;
        })
    }

    fetchRole() {
        this.roleService.getAllRole().subscribe({
            next: (res) => {
                this.roles = res.data ?? [];
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
        this.selectedRole.set({
            roleName: '',
            status: 0
        });
        this.showModal = true;
    }

    openEditModal(role: RoleBase) {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.selectedRoleId = role.roleId;
        this.modalMode = 'edit';
        this.selectedRole.set({
            roleName: role.roleName,
            status: role.status
        });
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveRole() {
        this.showErrors.set(true);
        const payload = this.selectedRole();
        console.log("payload : ", payload);

        if (!this.isFormValid()) {
            return;
        }
        if (this.modalMode === 'add') {
            console.log('ADD ROLE');
            this.roleService.createRole(payload).subscribe({
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
                    this.fetchRole();
                    this.closeModal();
                }
            });
        } else {
            console.log('EDIT ROLE');
            this.roleService.updateRole(this.selectedRoleId, payload).subscribe({
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
                    this.fetchRole();
                    this.closeModal();
                }
            })
        }
    }

    deleteRole(roleId: number) {
        this.showErrors.set(true);
        const payload = this.selectedRole();
        console.log("payload : ", payload);
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete Role ${payload.roleName} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('DELETE ROLE');
                this.roleService.deleteRole(roleId).subscribe({
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