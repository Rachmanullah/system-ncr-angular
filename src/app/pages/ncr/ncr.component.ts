import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../component/button/button';
import { InputComponent } from '../../component/inputCustom/input.component';
import { ModalComponent } from '../../component/modal/modal.component';
import { BreadCrumbComponent } from '../../component/breadcrumb/breadcrumb';
import { CircularProgressComponent } from '../../component/circularProgress/ciruclarProgress.component';
import { BUTTON_RADIUS, BUTTON_SIZES, BUTTON_VARIANTS } from '../../constant/button.constant';
import { ActivatedRoute } from '@angular/router';
import { NCRBase, NCRDetailRequest, NCRLogsBase, NCRRequest } from '../../core/class/ncr.class';
import { NCRService } from '../../service/ncr.service';
import { formatDate, formatDate2 } from '../../helper/dateFormat';
import { selectInput } from '../../core/class/selectInput.class';
import { SelectInputComponent } from '../../component/selectInput/selectInput';
import { CATEGORYCONSTANT } from '../../constant/category.constant';
import { PRIORITYCONSTANT } from '../../constant/priority.constant';
import { AuthBase } from '../../core/class/auth.class';
import { AuthService } from '../../service/auth.service';
import { STATUS_DRAFT } from '../../constant/status.constant';
import { TabItem, TabsComponent } from '../../component/tabs/tabs.component';
import { TextareaComponent } from '../../component/textArea/textarea.component';
import Swal from 'sweetalert2';
import { NCRMatrixBase } from '../../core/class/matrix.class';
import { HasPermissionDirective } from '../../helper/permissionDirective';
import { SearchInputComponent } from '../../component/searchInput/searchInput';
import { SearchFilterPayload } from '../../core/class/searchFilterPayload.class';

@Component({
    selector: 'app-ncr',
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
        TabsComponent,
        TextareaComponent,
        HasPermissionDirective,
        SearchInputComponent
    ],
    templateUrl: './ncr.component.html',
})
export class NCRComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;

    constructor(
        private ncrService: NCRService,
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
    ncrData: NCRBase[] = [];
    filteredData: NCRBase[]=[];
    ncrMatrixData: NCRMatrixBase[] = [];
    selectMatrixData: NCRMatrixBase = {
        ncrMatrixId: 0,
        ncrMatrixCode: '',
        departmentId: 0,
        departmentCode: '',
        departmentName: '',
        status: 0,
        approver: []
    };
    categoryData: selectInput[] = CATEGORYCONSTANT.map((res: any) => ({
        label: res.categoryName,
        value: res.categoryValue,
    }));
    priorityData: selectInput[] = PRIORITYCONSTANT.map((res: any) => ({
        label: res.priorityName,
        value: res.priorityValue,
    }));
    selectedNcrId: number = 0;
    selectedNcr = signal<NCRRequest>({
        ncrNumber: '',
        ncrTitle: '',
        ncrProject: '',
        ncrDate: '',
        ncrImplementationDate: '',
        implementationId: 0,
        ncrCategory: '',
        action: '',
        requestorId: 0,
        requestorName: '',
        departmentId: 0,
        departmentName: '',
        statusCode: '',
        statusName: '',
        detail: {} as NCRDetailRequest,
    });
    selectedNcrLogs : NCRLogsBase[] = [];
    showModal = false;
    isLoading = true;
    submitting = false;
    modalMode= signal<'add' | 'edit'>('add');
    showErrors = signal(false);
    backendErrors = signal<Record<string, string>>({});
    showApproverErrors = signal(false);
    activeTab = signal('detail');
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;
    
    tabs: TabItem[] = [
        {
            id: 'detail',
            title: 'Detail'
        },
        {
            id: 'attachment',
            title: 'Attachment'
        },
        {
            id: 'approval',
            title: 'Approval'
        },
        {
            id: 'log',
            title: 'Log'
        }
    ];

    validationErrors = computed(() => {
        const ncr = this.selectedNcr();
        const backend = this.backendErrors();

        return {
            ncrNumber: backend['ncrBackend'],
            ncrTitle: backend['ncrTitle'] || (!ncr.ncrTitle?.trim() ? 'NCR Title Required' : ''),
            ncrProject: backend['ncrProject'] || (!ncr.ncrProject?.trim() ? 'NCR Project Required' : ''),
            ncrDate: backend['ncrDate'] || (!ncr.ncrDate?.trim() ? 'NCR Date Required' : ''),
            ncrCategory: backend['ncrCategory'] || (!ncr.ncrCategory?.trim() ? 'NCR Category Required' : ''),
            requestorId: backend['requestorId'] || (ncr.requestorId <= 0 ? 'Requestor Required' : ''),
            departmentId: backend['departmentId'] || (ncr.departmentId <= 0 ? 'Department Required' : ''),
            action: backend['action'] || (!ncr.action?.trim() ? 'Action Required' : ''),
            ncrImplementationDate: backend['ncrImplementationDate'],
            implementationId: backend['implementationId'],
            description: backend['detail.description'] || (!ncr.detail?.description?.trim() ? 'Description Required' : ''),
            priority: backend['detail.priority'] || (!ncr.detail?.priority?.trim() ? 'Priority Required' : ''),
            asIs: backend['detail.asIs'],
            toBe: backend['detail.toBe'],
            benefit: backend['detail.benefit'],
            impact: backend['detail.impact'],
            financialImpact: backend['detail.financialImpact'],
        };
    });

    isFormValid = computed(() => {
        const errors = this.validationErrors();
        return Object.values(errors).every((error) => !error);
    });

    updateField<K extends keyof NCRRequest>(
        key: K,
        value: NCRRequest[K]
    ) {
        this.selectedNcr.update(ncr => ({
            ...ncr,
            [key]: value,
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    updateDetailField<K extends keyof NCRDetailRequest>(
        key: K,
        value: NCRDetailRequest[K]
    ) {
        this.selectedNcr.update(ncr => ({
            ...ncr,
            detail: {
                ...ncr.detail,
                [key]: value
            }
        }));

        this.backendErrors.update(errors => ({
            ...errors,
            [key]: ''
        }));
    }

    isAdministrator(): boolean {
        return this.user?.roleName === 'Administrator';
    }

    isReadonly = computed(() => {
        const ncr = this.selectedNcr();
        const mode = this.modalMode();

        const statusLocked = ncr.statusCode === 'NCR_CCL' || ncr.statusCode === 'NCR_WAP';
        const notOwner = ncr.requestorId != this.user.userId;

        const noWritePermission = mode === 'add'
            ? !this.authService.hasPermission('CREATE_NCR')
            : !this.authService.hasPermission('UPDATE_NCR');

        return statusLocked || notOwner || noWritePermission;
    });

    canSubmit = computed(() => this.authService.hasPermission('SUBMIT_NCR'));
    loadData() {
        this.route.data.subscribe((data) => {
            this.ncrData = (data['ncrData'] ?? []).filter((ncr: NCRBase) => {
                if (this.isAdministrator()) {
                    return true;
                }

                return ncr.requestorId === this.user.userId;
            }).map((res: any) => ({
                ...res,
                ncrDate: formatDate(res.ncrDate),
            }));
            this.ncrMatrixData = data['matrixApprovalData'];
            this.applyFilter('');
            this.isLoading = false;
        });
    }

    fetchNcr() {
        this.ncrService.getAllNcr().subscribe({
            next: (res) => {
                this.ncrData = (res.data ?? []).filter((ncr: NCRBase) => {
                    if (this.isAdministrator()) {
                        return true;
                    }
                    return ncr.requestorId === this.user.userId;
                });
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

    findMatrixNcr(departmentId: number){
        console.log("departmentId : ",departmentId);
        const result = this.ncrMatrixData.find(res => res.departmentId == departmentId);
        if (result) {
            console.log("matrix :", true);
            this.selectMatrixData = {
                ncrMatrixId: result.ncrMatrixId,
                ncrMatrixCode: result.ncrMatrixCode,
                departmentId : result.departmentId,
                departmentCode: result.departmentCode,
                departmentName: result.departmentName,
                status: result.status,
                approver: result.approver
            }
        }else{
            console.log("matrix :", false);
        }
    }

    applyFilter(filter?: SearchFilterPayload | string | null) {
            let searchText = '';
    
            if (typeof filter === 'string') {
                searchText = filter;
            } else {
                searchText = filter?.text ?? '';
            }
            const text = searchText.toLowerCase();
            this.filteredData = this.ncrData.filter(a =>
                (a.ncrNumber ?? '').toLowerCase().includes(text) ||
                (a.departmentName ?? '').toLowerCase().includes(text) ||
                (a.ncrCategory ?? '').toLowerCase().includes(text) ||
                (a.ncrProject ?? '').toLowerCase().includes(text) ||
                (a.ncrTitle ?? '').toLowerCase().includes(text) ||
                (a.requestorName ?? '').toLowerCase().includes(text)
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
        this.selectedNcrLogs = [];
        this.modalMode.set("add")
        const ncrDate = formatDate2(new Date()) ?? '';
        this.selectedNcr.set({
            ncrTitle: '',
            ncrNumber: '',
            ncrProject: '',
            ncrCategory: '',
            ncrDate: ncrDate,
            ncrImplementationDate: '',
            requestorId: Number(this.user.userId),
            requestorName: this.user.fullname,
            departmentId: Number(this.user.departmentId),
            departmentName: this.user.departmentName,
            implementationId: 0,
            action: '',
            statusCode: STATUS_DRAFT.statusCode,
            statusName: STATUS_DRAFT.statusName,
            detail: {} as NCRDetailRequest
        });
        this.findMatrixNcr(Number(this.user.departmentId));
        this.showModal = true;
    }

    openEditModal(item: NCRBase) {
        this.showErrors.set(false);
        const ncrDate = formatDate2(item.ncrDate) ?? '';
        const ncrImplementationDate = formatDate2(item.ncrImplementationDate) ?? '';
        this.backendErrors.set({});
        this.modalMode.set("edit");
        this.selectedNcrId = item.ncrId;
        this.selectedNcr.set({
            ncrTitle: item.ncrTitle,
            ncrNumber: item.ncrNumber,
            ncrProject: item.ncrProject,
            ncrCategory: item.ncrCategory,
            ncrDate: ncrDate,
            ncrImplementationDate: ncrImplementationDate,
            requestorId: item.requestorId,
            requestorName: item.requestorName,
            departmentId: item.departmentId,
            departmentName: item.departmentName,
            implementationId: item.implementationId,
            action: '',
            statusCode: item.statusCode,
            statusName: item.statusName,
            detail: {
                description: item.ncrDetail.description,
                priority: item.ncrDetail.priority,
                asIs: item.ncrDetail.asIs,
                toBe: item.ncrDetail.toBe,
                benefit: item.ncrDetail.benefit,
                impact: item.ncrDetail.impact,
                financialImpact: item.ncrDetail.financialImpact
            }
        });
        this.selectedNcrLogs = (item.ncrLogs ?? [] ).map((res) => ({
            ...res,
            date: formatDate(res.date) ?? ''
        }));    
        this.findMatrixNcr(item.departmentId);
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveNcr(action: string) {
        this.isLoading = true;
        const payload = {
            ...this.selectedNcr(),
            action: action
        };
        this.updateField("action", action);
        console.log("payload : ", JSON.stringify(payload));
        console.log("validation : ", JSON.stringify(this.validationErrors()));
        this.showErrors.set(true);

        if (!this.isFormValid()) {
            this.isLoading = false;
            return;
        }
        if(this.selectMatrixData.ncrMatrixId == 0 && action == 'Submit'){
            this.isLoading = false;
            Swal.fire('Warning', 'Matrix Approval Not Found For Department', 'warning');
            return;
        }
        if (this.modalMode() === 'add') {
            console.log('ADD NCR');
            this.ncrService.createNcr(payload).subscribe({
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
            console.log('EDIT NCR');
            this.ncrService.updateNcr(this.selectedNcrId, payload).subscribe({
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
                    this.fetchNcr();
                    this.closeModal();
                }
            })
        }
    }
    deleteNcr(ncr: NCRBase) {
        this.showErrors.set(true);
        console.log("payload : ", ncr);
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete NCR ${ncr.ncrNumber} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                console.log('DELETE NCR');
                this.ncrService.deleteNcr(ncr.ncrId).subscribe({
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
                        this.fetchNcr();
                    }
                })
            }
        })
    }
}
