import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'minutesToHour'
})

export class MinutesToHourPipe implements PipeTransform{

    transform(value: any) {
        if (value != null && value != undefined) {
            let m = value % 60;
            let h = Math.floor(value / 60);
            let ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12; // Convert 0 to 12
            return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
        }
        return null;
    }

}