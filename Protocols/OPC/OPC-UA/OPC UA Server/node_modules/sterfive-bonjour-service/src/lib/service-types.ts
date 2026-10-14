/**
 * Provide ServiceType
 */
export interface ServiceType {
    name?: string
    protocol?: 'tcp' | 'udp' | string | null | undefined
    subtypes?: Array<string>
}

/**
 * Provides underscore prefix to name
 * @param name
 * @returns
 */
const Prefix = (name: string): string => {
    return '_' + name
}

/**
 * Check if key is allowed
 * @param key
 * @returns
 */
const AllowedProp = (key: string): boolean => {
    let keys: Array<string> = ['name', 'protocol', 'subtypes']
    return keys.includes(key)
}

/**
 * Format input ServiceType to string
 * @param data
 * @returns
 */
export const toString = (data: ServiceType): string => {
    // Format to correct order
    let formatted: ServiceType = {
        name: data.name,
        protocol: data.protocol,
        subtypes: data.subtypes
    }
    // Output as entries array
    let entries: Array<[string, string[] | string]> = Object.entries(formatted)
    return entries
        .filter(([key, val]) => AllowedProp(key) && val !== undefined)
        .reduce((prev, [key, val]) => {
            switch (typeof val) {
                case 'object':
                    val.map((i: string) => prev.push(Prefix(i)))
                    break
                default:
                    prev.push(Prefix(val))
                    break
            }
            return prev
        }, [] as string[])
        .join('.')
}

/**
 * Format input string to ServiceType
 * @param string
 * @returns
 */
export const toType = (string: string): ServiceType => {
    // Split string into parts by dot
    const parts: Array<string> = string.split('.')
    // Remove the prefix
    for (let i in parts) {
        if (parts[i][0] !== '_') continue
        parts[i] = parts[i].slice(1)
    }
    // Format the output
    return {
        name: parts.shift(),
        protocol: parts.shift() || null,
        subtypes: parts
    }
}
