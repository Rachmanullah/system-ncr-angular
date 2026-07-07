import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    computed,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../component/button/button';
import { InputComponent } from '../../component/inputCustom/input.component';
import { CircularProgressComponent } from '../../component/circularProgress/ciruclarProgress.component';
import { UserRequest, UserBase } from '../../core/class/user.class';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { BUTTON_RADIUS, BUTTON_SIZES, BUTTON_VARIANTS } from '../../constant/button.constant';
import { ModalComponent } from '../../component/modal/modal.component';
import Swal from 'sweetalert2';
import { SelectInputComponent } from '../../component/selectInput/selectInput';
import { selectInput } from '../../core/class/selectInput.class';
import { BreadCrumbComponent } from '../../component/breadcrumb/breadcrumb';
import { SearchInputComponent } from '../../component/searchInput/searchInput';
import { HasPermissionDirective } from '../../helper/permissionDirective';
import { SearchFilterPayload } from '../../core/class/searchFilterPayload.class';

@Component({
    selector: 'app-user',
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
        SearchInputComponent,
        HasPermissionDirective
    ],
    templateUrl: './user.component.html',
})
export class UsersComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;

    users: UserBase[] = [];
    filteredData: UserBase[] = [];
    roles: selectInput[] = [];
    department: selectInput[] = [];
    selectedUserId: number = 0;
    selectedUser = signal<UserRequest>({
        username: '',
        fullname: '',
        password: '',
        email: '',
        position: '',
        departmentId: 0,
        roleId: 0,
    });
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;
    showModal = false;
    isLoading = true;
    submitting = false;
    modalMode: 'add' | 'edit' = 'add';
    showErrors = signal(false);
    backendErrors = signal<Partial<Record<keyof UserRequest, string>>>({});

    validationErrors = computed(() => {
        const user = this.selectedUser();
        const backend = this.backendErrors();

        return {
            fullname:
                backend.fullname ||
                (!user.fullname?.trim()
                    ? 'Full Name is required'
                    : ''),

            username:
                backend.username ||
                (!user.username?.trim()
                    ? 'Username is required'
                    : ''),

            email:
                backend.email ||
                (!user.email?.trim()
                    ? 'Email is required'
                    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
                        ? 'Email format invalid'
                        : ''),

            password:
                backend.password || '',

            position:
                backend.position ||
                (!user.position?.trim()
                    ? 'Position is required'
                    : ''),

            departmentId:
                backend.departmentId ||
                (!user.departmentId
                    ? 'Department is required'
                    : ''),

            roleId:
                backend.roleId ||
                (!user.roleId
                    ? 'Role is required'
                    : '')
        };
    });

    isFormValid = computed(() => {
        const errors = this.validationErrors();
        return Object.values(errors).every((error) => !error);
    });
    updateField<K extends keyof UserRequest>(
        key: K,
        value: UserRequest[K]
    ) {
        this.selectedUser.update(user => ({
            ...user,
            [key]: value,
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    private route = inject(ActivatedRoute);
    constructor(
        private userService: UserService,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) { }
    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            console.log(data);
            this.users = data['userData'];
            this.roles = (data['roleData'] ?? []).map((x: any) => ({
                label: x.roleName,
                value: x.roleId
            }));
            this.department = (data['departmentData'] ?? []).map((x: any) => ({
                label: x.departmentName,
                value: x.departmentId
            }));
            this.isLoading = false;
            this.applyFilter('');
        });
    }

    fetchUsers() {
        this.userService.getAllUser().subscribe({
            next: (res) => {
                this.users = res.data ?? [];
                this.isLoading = false;
                this.applyFilter('');
            },
            error: () => (this.isLoading = false),
            complete: () => this.cdr.detectChanges(),
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
        this.filteredData = this.users.filter(a =>
            (a.fullname ?? '').toLowerCase().includes(text) ||
            (a.username ?? '').toLowerCase().includes(text) ||
            (a.role.roleName ?? '').toLowerCase().includes(text) ||
            (a.department.departmentCode ?? '').toLowerCase().includes(text)
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
        this.selectedUser.set({
            username: '',
            fullname: '',
            password: '',
            email: '',
            position: '',
            departmentId: 0,
            roleId: 0
        });
        this.showModal = true;
    }

    openEditModal(user: UserBase) {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.selectedUserId = user.userId;
        this.modalMode = 'edit';
        this.selectedUser.set({
            username: user.username,
            fullname: user.fullname,
            password: '',
            email: user.email,
            position: user.position,
            departmentId: user.department.departmentId,
            roleId: user.role.roleId
        });
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveUser() {
        this.showErrors.set(true);
        const payload = this.selectedUser();
        console.log("payload : ", payload);

        if (!this.isFormValid()) {
            return;
        }
        if (this.modalMode === 'add') {
            console.log('ADD USER');
            this.userService.createUser(payload).subscribe({
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
                    this.fetchUsers();
                    this.closeModal();
                }
            });
        } else {
            console.log('EDIT USER');
            this.userService.updateUser(this.selectedUserId, payload).subscribe({
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
                    this.fetchUsers();
                    this.closeModal();
                }
            })
        }
    }

    deleteUser(userId: number) {
        this.showErrors.set(true);
        const payload = this.selectedUser();
        console.log("payload : ", payload);
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete User ${payload.fullname} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('DELETE USER');
                this.userService.deleteUser(userId).subscribe({
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
                        this.fetchUsers();
                    }
                })
            }
        })
    }
}