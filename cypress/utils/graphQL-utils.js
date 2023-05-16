export const operationNameValidation = (req, operationName) => {
    return (
        req.body.hasOwnProperty('operationName') && req.body.operationName === operationName
    )
};

export const setAlias = (req, operationName) => {
    if (operationNameValidation(req, operationName)) {
        req.alias = operationName
    }
};
