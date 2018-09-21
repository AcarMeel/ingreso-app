import * as fromUI from './ui.actions';

export interface State {
    isLoading: boolean;
}

const initState: State = {
    isLoading: false
};

export function uiReducer(state = initState, action: fromUI.actions): State {
    switch(action.type) {
        case fromUI.ACTIVATE_LOADING:
            return {
                isLoading: true
            };
        case fromUI.DEACTIVATE_LOADING:
        return {
            isLoading: false
        };
        default:
            return state;
    }
}