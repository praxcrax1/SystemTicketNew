import { createAction , props } from "@ngrx/store";
import { InputFormData } from "../DTO/InputFormData";

export const saveFormData = createAction(
    '[App] Save Form Data',
    props<{ payload: InputFormData }>()
  );
  
  // export const clearFormData = createAction('[App] Clear Form Data');