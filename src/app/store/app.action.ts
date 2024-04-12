import { createAction , props } from "@ngrx/store";
import { InputFormData } from "../DTO/InputFormData";

export const saveFormData = createAction(
    '[App] Save Form Data',
    props<{ payload: InputFormData }>()
);
export const saveStationData = createAction(
    '[App] Save Station Data',
    props<{ payload: any }>()
);

export const saveTrainList = createAction(
    '[App] Save Train Data',
    props<{ payload: any }>()
);
  
  // export const clearFormData = createAction('[App] Clear Form Data');