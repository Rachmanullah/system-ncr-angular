import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "../../component/button/button";
import { InputComponent } from "../../component/inputCustom/input.component";
import { CircularProgressComponent } from "../../component/circularProgress/ciruclarProgress.component";
import { ModalComponent } from "../../component/modal/modal.component";
import { BreadCrumbComponent } from "../../component/breadcrumb/breadcrumb";
import { SelectInputComponent } from "../../component/selectInput/selectInput";
import { TabItem, TabsComponent } from "../../component/tabs/tabs.component";
import { TextareaComponent } from "../../component/textArea/textarea.component";
import { BUTTON_RADIUS, BUTTON_SIZES, BUTTON_VARIANTS } from "../../constant/button.constant";
import { AuthService } from "../../service/auth.service";
import { ActivatedRoute } from "@angular/router";
import { AuthBase } from "../../core/class/auth.class";
import { NCRDetailRequest, NCRLogsBase } from "../../core/class/ncr.class";
import { NCRMatrixBase } from "../../core/class/matrix.class";
import { CATEGORYCONSTANT } from "../../constant/category.constant";
import { PRIORITYCONSTANT } from "../../constant/priority.constant";
import { selectInput } from "../../core/class/selectInput.class";
import Swal from "sweetalert2";
import { formatDate, formatDate2 } from "../../helper/dateFormat";
import { InboxService } from "../../service/inbox.service";
import { InboxBase, InboxRequest } from "../../core/class/inbox.class";

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
        TabsComponent,
        TextareaComponent
    ],
    templateUrl: './inbox.component.html'
})

export class InboxComponent implements OnInit {
    protected readonly BUTTON_VARIANTS = BUTTON_VARIANTS;
    protected readonly BUTTON_SIZES = BUTTON_SIZES;
    protected readonly BUTTON_RADIUS = BUTTON_RADIUS;

    constructor(
        private inboxService: InboxService,
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
    inboxData: InboxBase[] = [];
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
    selectedInboxId: number = 0;
    selectedInbox = signal<InboxRequest>({
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
        approver: 0,
        runningNumber: 0,
        approverNotes: '',
        detail: {} as NCRDetailRequest,
    });
    selectedInboxLogs: NCRLogsBase[] = [];
    showModal = false;
    isLoading = true;
    submitting = false;
    showErrors = signal(false);
    backendErrors = signal<Record<string, string>>({});
    showApproverErrors = signal(false);
    activeTab = signal('detail');
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
        const ncr = this.selectedInbox();
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
            approver: backend['approver'] || (ncr.approver <= 0 ? 'Approver Required' : ''),
            approverNotes: backend['approverNotes'] || (!ncr.approverNotes?.trim() ? 'Approver Notes Required' : ''),
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

    updateField<K extends keyof InboxRequest>(
        key: K,
        value: InboxRequest[K]
    ) {
        this.selectedInbox.update(ncr => ({
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
        this.selectedInbox.update(ncr => ({
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
    isReadonly = computed(() =>
        this.selectedInbox().statusCode != 'NCR_APP' ||
        !this.authService.hasPermission('REVIEW_NCR')
    );

    isDisabled = computed(() =>
        this.selectedInbox().approver != this.user.userId ||
        this.selectedInbox().statusCode == 'NCR_APP'
    );
    loadData() {
        this.route.data.subscribe((data) => {
            this.inboxData = (data['inboxData'] ?? []).filter((ncr: InboxBase) => {
                if (this.isAdministrator()) {
                    return true;
                }

                return ncr.approver === this.user.userId;
            }).map((res: any) => ({
                ...res,
                ncrDate: formatDate(res.ncrDate),
            }));
            this.ncrMatrixData = data['matrixApprovalData'];
            this.isLoading = false;
            this.cdr.detectChanges();
        });
    }

    fetchNcr() {
        this.inboxService.getAllNcrNeedApprove().subscribe({
            next: (res) => {
                this.inboxData = (res.data ?? []).filter((ncr: InboxBase) => {
                    if (this.isAdministrator()) {
                        return true;
                    }
                    return ncr.approver === this.user.userId;
                });
                this.isLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.isLoading = false;
            },
            complete: () => { this.cdr.detectChanges(); }
        });
    }

    findMatrixNcr(departmentId: number) {
        console.log("departmentId : ", departmentId);
        const result = this.ncrMatrixData.find(res => res.departmentId == departmentId);
        if (result) {
            console.log("matrix :", true);
            this.selectMatrixData = {
                ncrMatrixId: result.ncrMatrixId,
                ncrMatrixCode: result.ncrMatrixCode,
                departmentId: result.departmentId,
                departmentCode: result.departmentCode,
                departmentName: result.departmentName,
                status: result.status,
                approver: result.approver
            }
        } else {
            console.log("matrix :", false);
        }
    }

    openDetailModal(item: InboxBase) {
        this.showErrors.set(false);
        const ncrDate = formatDate2(item.ncrDate) ?? '';
        const ncrImplementationDate = formatDate2(item.ncrImplementationDate) ?? '';
        this.backendErrors.set({});
        this.selectedInboxId = item.ncrId;
        this.selectedInbox.set({
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
            runningNumber: item.runningNumber,
            approver: item.approver,
            approverNotes: item.approverNotes,
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
        this.selectedInboxLogs = (item.ncrLogs ?? []).map((res) => ({
            ...res,
            date: formatDate(res.date) ?? ''
        }));
        this.findMatrixNcr(item.departmentId);
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }


    canApprove = computed(() =>
        !this.isDisabled() && this.authService.hasPermission('APPROVE_NCR')
    );
    canReject = computed(() =>
        !this.isDisabled() && this.authService.hasPermission('REJECT_NCR')
    );
    canAssign = computed(() =>
        !this.isDisabled() && this.authService.hasPermission('ASSIGN')
    );
    canReview = computed(() =>
        !this.isDisabled() && this.authService.hasPermission('REVIEW_NCR')
    );
    canClose = computed(() =>
        !this.isDisabled() && this.authService.hasPermission('CLOSE_NCR')
    );

    processNcr(action: string) {
        this.isLoading = true;
        const payload = {
            ...this.selectedInbox(),
            action: action
        };
        this.updateField("action", action);
        console.log("payload : ", JSON.stringify(payload));
        console.log("validation : ", JSON.stringify(this.validationErrors()));
        if (this.selectedInbox().approverNotes == '') {
            this.backendErrors.set({
                'approverNotes': 'Approver Notes Required'
            });
        }
        this.showErrors.set(true);

        if (!this.isFormValid()) {
            this.isLoading = false;
            return;
        }
        if (this.selectMatrixData.ncrMatrixId == 0 && action == 'Approve') {
            this.isLoading = false;
            Swal.fire('Warning', 'Matrix Approval Not Found For Department', 'warning');
            return;
        }

        if (action !== 'Approve' && action !== 'Reject') {
            this.isLoading = false;
            return;
        }

        const request$ = action === 'Approve'
            ? this.inboxService.approveNcr(payload)
            : this.inboxService.rejectNcr(payload);

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
                this.loadData();
                this.closeModal();
                this.cdr.detectChanges();
            }
        });
    }
}