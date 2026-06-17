import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface TabItem {
    id: string;
    title: string;
}

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tabs.component.html',
})

export class TabsComponent {
    @Input() tabs: TabItem[] = [];
    @Input() activeTab = '';

    @Output() tabChange = new EventEmitter<string>();

    selectTab(tabId: string) {
        this.tabChange.emit(tabId);
    }
}