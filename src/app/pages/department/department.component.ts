import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "../../component/button/button";
import { InputComponent } from "../../component/inputCustom/input.component";
import { CircularProgressComponent } from "../../component/circularProgress/ciruclarProgress.component";
import { ModalComponent } from "../../component/modal/modal.component";
import { BreadCrumbComponent } from "../../component/breadcrumb/breadcrumb";
import { BUTTON_RADIUS, BUTTON_SIZES, BUTTON_VARIANTS } from "../../constant/button.constant";
import { DepartmentBase, DepartmentRequest } from "../../core/class/department.class";
import { DepartmentService } from "../../service/department.service";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { SearchInputComponent } from "../../component/searchInput/searchInput";
import { AuthBase } from "../../core/class/auth.class";
import { UserService } from "../../service/user.service";
import { AuthService } from "../../service/auth.service";
import { SearchFilterPayload } from "../../core/class/searchFilterPayload.class";

@Component({
    selector: 'app-department',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        InputComponent,
        CircularProgressComponent,
        ModalComponent,
        BreadCrumbComponent,
        SearchInputComponent
    ],
    templateUrl: './department.component.html',
})
export class DepartmentComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;
    private route = inject(ActivatedRoute);
    user: AuthBase = {
        userId: 0,
        fullname: '',
        position: '',
        departmentId: 0,
        departmentName: '',
        roleName: ''
    };
    department: DepartmentBase[] = [];
    filteredData: DepartmentBase[] = [];
    selectedDepartmentId: number = 0;
    selectedDepartment = signal<DepartmentRequest>({
        departmentCode: '',
        departmentName: ''
    });

    showModal = false;
    isLoading = true;
    submitting = false;
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;
    modalMode: 'add' | 'edit' = 'add';
    showErrors = signal(false);
    backendErrors = signal<Partial<Record<keyof DepartmentRequest, string>>>({});

    validationErrors = computed(() => {
        const department = this.selectedDepartment();
        const backend = this.backendErrors();

        return {
            departmentCode: backend.departmentCode || (!department.departmentCode?.trim() ? 'Department Code is required' : ''),
            departmentName: backend.departmentName || (!department.departmentName?.trim() ? 'Department Name is required' : '')
        };
    });

    isFormValid = computed(() => {
        const errors = this.validationErrors();
        return Object.values(errors).every((error) => !error);
    });

    updateField<K extends keyof DepartmentRequest>(
        key: K,
        value: DepartmentRequest[K]
    ) {
        this.selectedDepartment.update(department => ({
            ...department,
            [key]: value,
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    constructor(
        private departmentService: DepartmentService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
        this.route.data.subscribe((data) => {
            console.log(data);
            this.department = data['departmentData'];
            this.isLoading = false;
            this.applyFilter('');
        })
    }

    applyFilter(filter?: SearchFilterPayload | string | null) {
        let searchText = '';

        if (typeof filter === 'string') {
            searchText = filter;
        } else {
            searchText = filter?.text ?? '';
        }
        const text = searchText.toLowerCase();
        this.filteredData = this.department.filter(a =>
            (a.departmentCode ?? '').toLowerCase().includes(text) ||
            (a.departmentName ?? '').toLowerCase().includes(text)
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
    fetchDepartment() {
        this.departmentService.getAllDepartment().subscribe({
            next: (res) => {
                this.department = res.data ?? [];
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

    openAddModal() {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.modalMode = 'add';
        this.selectedDepartment.set({
            departmentCode: '',
            departmentName: ''
        });
        this.showModal = true;
    }

    openEditModal(department: DepartmentBase) {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.selectedDepartmentId = department.departmentId;
        this.modalMode = 'edit';
        this.selectedDepartment.set({
            departmentCode: department.departmentCode,
            departmentName: department.departmentName
        });
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveDepartment() {
        this.showErrors.set(true);
        const payload = this.selectedDepartment();
        console.log("payload : ", payload);

        if (!this.isFormValid()) {
            return;
        }
        if (this.modalMode === 'add') {
            console.log('ADD DEPARTMENT');
            this.departmentService.createDepartment(payload).subscribe({
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
                    this.fetchDepartment();
                    this.closeModal();
                }
            });
        } else {
            console.log('EDIT DEPARTMENT');
            this.departmentService.updateDepartment(this.selectedDepartmentId, payload).subscribe({
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
                    this.fetchDepartment();
                    this.closeModal();
                }
            })
        }
    }

    deleteDepartment(departmentId: number) {
        this.showErrors.set(true);
        const payload = this.selectedDepartment();
        console.log("payload : ", payload);
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete Department ${payload.departmentName} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('DELETE DEPARTMENT');
                this.departmentService.deleteDepartment(departmentId).subscribe({
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
                        this.fetchDepartment();
                    }
                })
            }
        })
    }
}