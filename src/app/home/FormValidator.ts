import { FormControl } from "@angular/forms";

export class FormValidator {
    static validatePNR(pnr: FormControl){
        let resp = null;
        let pnrNo = (pnr.value ? pnr.value : '') + "";
        console.log("INPUT PNR IS ", pnrNo);
        if(!(pnrNo == "" || pnrNo[0] == '2' || pnrNo[0] == '4' || pnrNo[0] == '6' || pnrNo[0] == '8')){
            resp = "Invalid PNR"
        }
        else if(pnrNo.length > 0 && (pnrNo.length < 10  || pnrNo.length > 10)){
            resp = "PNR should be a 10 digit number"
        }
        return {"error": resp};
    }
    
        // static validateTrainNo(trainNo: FormControl){
        //     let resp = null;
        //     let train = (trainNo.value ? trainNo.value: '') + "";
        //     console.log("INPUT TRAIN IS ", train);
        //     if(train.length > 0 && (train.length < 5  || train.length > 5)){
        //         resp = "Train Number should be a 5 digit number "
        //     }
        //     return {"error": resp};
        // }
}

