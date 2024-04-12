import { Pipe, PipeTransform } from "@angular/core";
import { Store } from "@ngrx/store";
import * as rootReducer from '../store/root.reducer';




@Pipe({
    standalone: true,
    name: 'stationName'
})

export class stationNamePipe implements PipeTransform{

    stationData: any;

    constructor(private store: Store) {
        this.store.select(rootReducer.getStationData)
        .subscribe((stationData) => {
          console.log("stationData Data", stationData)
          this.stationData = stationData;
        });
    }
    
    transform(value: string): String {
        let station = this.stationData[value];
        return station ? station.en : value;
    }
}