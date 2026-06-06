export interface ModalField{
    key: string;
    label: string;
    type: 'text' | 'password' | 'select' | 'date' | 'number' | 'datetime' | 'email' | 'file' | 'hidden' | 'month' | 'time' | 'week';
    required: boolean;
    options?: { label: string; value: any }[];
    hiddenOnEdit?: boolean;
    fullWidth?: boolean;
}