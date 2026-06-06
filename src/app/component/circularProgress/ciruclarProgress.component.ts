import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    standalone: true,
    selector: "app-circularProgress",
    imports: [CommonModule],
    templateUrl: './circularProgress.html'
})

export class CircularProgressComponent {
    @Input() isLoading: boolean = false;
}