import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "../../component/button/button";
import { InputComponent } from "../../component/inputCustom/input.component";
import { CircularProgressComponent } from "../../component/circularProgress/ciruclarProgress.component";
import { ModalComponent } from "../../component/modal/modal.component";
import { BreadCrumbComponent } from "../../component/breadcrumb/breadcrumb";
import { BUTTON_RADIUS, BUTTON_SIZES, BUTTON_VARIANTS } from "../../constant/button.constant";
import { AuthService } from "../../service/auth.service";
import { PermissionService } from "../../service/permission.service";
import { ActivatedRoute } from "@angular/router";
import { AuthBase } from "../../core/class/auth.class";
import { PermissionBase, PermissionRequest } from "../../core/class/permission.class";
import Swal from "sweetalert2";
import { selectInput } from "../../core/class/selectInput.class";
import { SelectInputComponent } from "../../component/selectInput/selectInput";
import { SearchInputComponent } from "../../component/searchInput/searchInput";
import { SearchFilterPayload } from "../../core/class/searchFilterPayload.class";
import { HasPermissionDirective } from "../../helper/permissionDirective";
enum FormMode {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE'
};
@Component({
    selector: 'app-inbox',
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
        HasPermissionDirective,
    ],
    templateUrl: './permission.component.html'
})

export class PermissionComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;
    protected readonly FormMode = FormMode;

    constructor(
        private permissionService: PermissionService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef,
    ) { }
    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
        });
        this.loadData();
    }
    private route = inject(ActivatedRoute);
    user: AuthBase = {
        userId: 0,
        fullname: '',
        position: '',
        departmentId: 0,
        departmentName: '',
        roleName: ''
    };
    permissionData: PermissionBase[] = [];
    filteredData: PermissionBase[]=[];
    selectedPermissionId: number = 0;
    selectedPermission = signal<PermissionRequest>({
        permissionCode: '',
        permissionDescription: '',
        isActive: 0
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
    isLoading = true;
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;
    showErrors = signal(false);
    backendErrors = signal<Record<string, string>>({});
    showApproverErrors = signal(false);
    formMode = signal<FormMode>(FormMode.CREATE);

    validationErrors = computed(() => {
        const ncr = this.selectedPermission();
        const backend = this.backendErrors();

        return {
            permissionCode: backend['permissionCode'] || (!ncr.permissionCode?.trim() ? 'Permission Code Required' : ''),
            permissionDescription: backend['permissionDescription'],
            isActive: backend['isActive'] || (ncr.isActive ? 'Is Active Required' : ''),
        };
    });

    isFormValid = computed(() => {
        const errors = this.validationErrors();
        return Object.values(errors).every((error) => !error);
    });

    updateField<K extends keyof PermissionRequest>(
        key: K,
        value: PermissionRequest[K]
    ) {
        this.selectedPermission.update(ncr => ({
            ...ncr,
            [key]: value,
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    loadData() {
        this.route.data.subscribe((data) => {
            this.permissionData = data['permissionData'];
            this.isLoading = false;
            this.applyFilter('');
            this.cdr.detectChanges();
        });
    }

    noWritePermission = computed(() => {
        const noWritePermission = this.formMode() === FormMode.CREATE
            ? !this.authService.hasPermission('CREATE_PERMISSION')
            : !this.authService.hasPermission('UPDATE_PERMISSION');

        return noWritePermission;
    });

    fetchNcr() {
        this.permissionService.getAllPermission().subscribe({
            next: (res) => {
                this.permissionData = res.data;
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
        this.filteredData = this.permissionData.filter(a =>
            (a.permissionCode ?? '').toLowerCase().includes(text) ||
            (a.permissionDescription ?? '').toLowerCase().includes(text)
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

    editPermission(item: PermissionBase) {
        this.selectedPermissionId = item.permissionId;
        this.selectedPermission.set({
            permissionCode: item.permissionCode,
            permissionDescription: item.permissionDescription,
            isActive: item.isActive
        });
        this.formMode.set(FormMode.UPDATE);
        this.showErrors.set(false);
        this.backendErrors.set({});
    }

    resetForm() {
        this.selectedPermissionId = 0;
        this.selectedPermission.set({
            permissionCode: '',
            permissionDescription: '',
            isActive: 0
        });
        this.formMode.set(FormMode.CREATE);
        this.showErrors.set(false);
        this.backendErrors.set({});
    }

    submitPermission() {
        this.isLoading = true;
        const payload = {
            ...this.selectedPermission()
        };
        console.log("payload : ", JSON.stringify(payload));
        console.log("validation : ", JSON.stringify(this.validationErrors()));

        this.showErrors.set(true);

        if (!this.isFormValid()) {
            this.isLoading = false;
            return;
        }

        const request$ = this.formMode() === FormMode.CREATE
            ? this.permissionService.createPermission(payload)
            : this.permissionService.updatePermission(this.selectedPermissionId, payload)

        request$.subscribe({
            next: (res) => {
                this.isLoading = false;
                Swal.fire('Success', res.message, 'success');
            },
            error: (err) => {
                console.log(err);
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
                this.fetchNcr();
                this.resetForm();
                this.cdr.detectChanges();
            }
        });
    }

    deletePermission(item: PermissionBase) {
        Swal.fire({
            title: 'Delete?',
            text: item.permissionCode,
            icon: 'warning',
            showCancelButton: true
        }).then(result => {
            if (!result.isConfirmed) {
                return;
            }
            this.permissionService
                .deletePermission(item.permissionId)
                .subscribe({
                    next: res => {
                        Swal.fire(
                            'Deleted',
                            res.message,
                            'success'
                        );
                        this.fetchNcr();
                    }
                });
        });

    }
}