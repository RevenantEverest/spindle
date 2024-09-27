export function isStringFormula(formula: any): formula is { string: string } {
    return formula && typeof formula.string === 'string';
};

export function isMultiSelectProperty(property: any): property is { multi_select: { id: string; name: string; color: string }[] } {
    return property && Array.isArray(property.multi_select) && property.multi_select.every(
        (item: any) => typeof item.id === 'string' &&
                       typeof item.name === 'string' &&
                       typeof item.color === 'string'
    );
};