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
import { NCRMatrixBase, NCRMatrixRequest } from "../../core/class/matrix.class";
import { NCRMatrixApprovalService } from "../../service/matrixApproval.service";
import { selectInput } from "../../core/class/selectInput.class";
import { ApproverRequest } from "../../core/class/approver.class";
import Swal from "sweetalert2";
import { SelectInputComponent } from "../../component/selectInput/selectInput";
import { generateMatrixNumber } from "../../helper/generateMatrixNumber";

@Component({
    selector: 'app-ncr-matrix',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonComponent,
        InputComponent,
        CircularProgressComponent,
        SelectInputComponent,
        ModalComponent,
        BreadCrumbComponent
    ],
    templateUrl: './matrixApproval.component.html',
})
export class NCRMatrixApprovalComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;
    private route = inject(ActivatedRoute);

    matrixs: NCRMatrixBase[] = [];
    approverData: selectInput[] = [];
    departmentData: selectInput[] = [];
    departments: any[] = [];
    selectedMatrixId: number = 0;
    approverList = signal<ApproverRequest[]>([]);
    selectedMatrix = signal<NCRMatrixRequest>({
        ncrMatrixCode: '',
        departmentId: 0,
        approver: [] as ApproverRequest[],
        status: 0,
    });
    selectedApprover = signal<ApproverRequest>({
        approverId: 0,
        orderNumber: 1
    });
    selectedApproverIndex = -1;

    showApproverModal = false;
    showModal = false;
    isLoading = true;
    submitting = false;
    modalMode: 'add' | 'edit' = 'add';
    showErrors = signal(false);
    backendErrors = signal<Partial<Record<keyof NCRMatrixRequest, string>>>({});
    showApproverErrors = signal(false);

    validationErrors = computed(() => {
        const matrix = this.selectedMatrix();
        const backend = this.backendErrors();

        return {
            ncrMatrixCode:
                backend.ncrMatrixCode ||
                (!matrix.ncrMatrixCode?.trim()
                    ? 'Matrix Code is required'
                    : ''),

            departmentId:
                backend.departmentId ||
                (matrix.departmentId <= 0
                    ? 'Department is required'
                    : ''),

            approver:
                backend.approver ||
                (matrix.approver.length === 0
                    ? 'Approver is required'
                    : '')
        };
    });

    approverValidationErrors = computed(() => {
        const approver = this.selectedApprover();

        return {
            approverId:
                approver.approverId <= 0
                    ? 'Approver Required'
                    : ''
        };
    });

    isApproverValid = computed(() => {
        const errors = this.approverValidationErrors();

        return Object.values(errors).every(error => !error);
    });

    isFormValid = computed(() => {
        const errors = this.validationErrors();
        return Object.values(errors).every((error) => !error);
    });

    updateField<K extends keyof NCRMatrixRequest>(
        key: K,
        value: NCRMatrixRequest[K]
    ) {
        this.selectedMatrix.update(matrix => ({
            ...matrix,
            [key]: value,
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    constructor(
        private matrixApprovalService: NCRMatrixApprovalService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.route.data.subscribe((data) => {
            console.log(data);
            this.matrixs = data['matrixApprovalData'];
            this.departments = data['departmentData'] ?? [];
            this.approverData = (data['userData'] ?? []).map((res: any) => ({
                label: res.fullname,
                value: res.userId
            }))
            this.departmentData = (data['departmentData'] ?? []).map((res: any) => ({
                label: res.departmentName,
                value: res.departmentId
            }))
            this.isLoading = false;
        })
    }

    fetchMatrixApproval() {
        this.matrixApprovalService.getAllMatrix().subscribe({
            next: (res) => {
                this.matrixs = res.data ?? [];
                this.isLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.isLoading = false;
            },
            complete: () => { this.cdr.detectChanges(); }
        });
    }

    openAddApproverModal() {
        this.showApproverErrors.set(false);
        this.selectedApproverIndex = -1;

        this.selectedApprover.set({
            approverId: 0,
            orderNumber: this.selectedMatrix().approver.length + 1
        });

        this.showApproverModal = true;
    }

    openEditApproverModal(index: number) {
        this.showApproverErrors.set(false);
        const approver = this.selectedMatrix().approver[index];

        this.selectedApproverIndex = index;

        this.selectedApprover.set({
            approverId: approver.approverId,
            orderNumber: approver.orderNumber
        });

        this.showApproverModal = true;
    }

    saveApprover() {
        this.showApproverErrors.set(true);
        if (!this.isApproverValid()) {
            return;
        }
        const approver = this.selectedApprover();
        this.selectedMatrix.update(matrix => {
            const approvers = [...matrix.approver];
            if (this.selectedApproverIndex >= 0) {
                approvers[this.selectedApproverIndex] = approver;
            } else {
                approvers.push(approver);
            }
            return {
                ...matrix,
                approver: approvers
            };
        });
        this.showApproverModal = false;
    }

    deleteApprover(index: number) {
        this.selectedMatrix.update(matrix => ({
            ...matrix,
            approver: matrix.approver
                .filter((_, i) => i !== index)
                .map((approver, idx) => ({
                    ...approver,
                    orderNumber: idx + 1
                }))
        }));
    }

    onDepartmentChange(departmentId: number) {

        const department = this.departments.find(
            x => x.departmentId === departmentId
        );

        const matrixCode = generateMatrixNumber(
            department?.departmentCode ?? ''
        );

        this.selectedMatrix.update(matrix => ({
            ...matrix,
            departmentId,
            ncrMatrixCode: matrixCode
        }));
    }

    openAddModal() {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.modalMode = 'add';
        this.selectedMatrix.set({
            ncrMatrixCode: generateMatrixNumber(''),
            departmentId: 0,
            approver: [] as ApproverRequest[],
            status: 0
        });
        this.showModal = true;
    }

    getApproverName(id: number): string {
        const user = this.approverData.find(
            x => Number(x.value) === id
        );
        return user?.label ?? '-';
    }

    openEditModal(matrix: NCRMatrixBase) {
        this.showErrors.set(false);
        this.backendErrors.set({});
        this.selectedMatrixId = matrix.ncrMatrixId;
        this.modalMode = 'edit';
        this.selectedMatrix.set({
            ncrMatrixCode: matrix.ncrMatrixCode,
            departmentId: matrix.departmentId,
            approver: (matrix.approver ?? []).map((res: any) => ({
                approverId: res.approverId,
                orderNumber: res.orderNumber
            })),
            status: matrix.status
        });
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }
    closeModalApprover() {
        this.showApproverModal = false;
    }

    saveMatrix() {
        this.showErrors.set(true);
        const payload = this.selectedMatrix();
        console.log("payload : ", payload);

        if (!this.isFormValid()) {
            if (this.validationErrors().approver) {
                Swal.fire('Error', this.validationErrors().approver, 'warning');
            }
            return;
        }
        if (this.modalMode === 'add') {
            console.log('ADD MATRIX APPROVAL');
            this.matrixApprovalService.createMatrix(payload).subscribe({
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
                    this.loadData();
                    this.closeModal();
                }
            });
        } else {
            console.log('EDIT MATRIX APPROVAL');
            this.matrixApprovalService.updateMatrix(this.selectedMatrixId, payload).subscribe({
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
                    this.fetchMatrixApproval();
                    this.closeModal();
                    this.closeModalApprover();
                }
            })
        }
    }

    deleteMatrix(matrixId: number) {
        this.showErrors.set(true);
        const payload = this.selectedMatrix();
        console.log("payload : ", payload);
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete Matrix ${payload.ncrMatrixCode} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('DELETE MATRIX APPROVAL');
                this.matrixApprovalService.deleteMatrix(matrixId).subscribe({
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
                        this.fetchMatrixApproval();
                    }
                })
            }
        })
    }
}