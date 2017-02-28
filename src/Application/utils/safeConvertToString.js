export default function safeConvertToString(value) {
    if (Array.isArray(value)) {
        return value
    }
    if (value === undefined || value === null || value === '') {
        return undefined
    }
    return value + ''
}
