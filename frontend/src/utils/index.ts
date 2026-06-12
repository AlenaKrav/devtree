export function classNames(...classes : string[]) {
    return classes.filter(Boolean).join(' ')
}

export function linkIsValid (link: string) {
    try {
        new URL(link);
        return true;
    } catch (error) {
        return false;
    }
}