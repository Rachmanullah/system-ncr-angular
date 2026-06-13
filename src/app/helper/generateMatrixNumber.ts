export function generateMatrixNumber(departmentCode: string): string {

    const code = 'NCR';
    const year = new Date().getFullYear();

    return `${code}-${departmentCode}-${year}-XXXX`;
}