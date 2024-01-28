import {
    Actions,
    ActionsTemplates,
    WorkflowTemplates,
    Workflows,
} from "../../types";

export const actionsDir = (action: Actions): ActionsTemplates => {
    return `actions/${action}`;
};
