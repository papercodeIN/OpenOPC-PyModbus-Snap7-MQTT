type KeyValue = Record<string, any>

export class DnsTxt {
    private binary: boolean

    constructor(opts: KeyValue = {}) {
        this.binary = opts ? opts.binary : false
    }

    /**
     * Encode the KeyValue to buffer
     * @param data
     * @returns
     */
    public encode(data: KeyValue = {}) {
        return Object.entries(data).map(([key, value]) => {
            let item: string = `${key}=${value}`
            return Buffer.from(item)
        })
    }

    /**
     * Decode the buffer to KeyValue
     * @param buffer
     * @returns
     */
    public decode(buffer: Buffer): KeyValue {
        const data: KeyValue = {}
        // Format buffer to KeyValue
        try {
            let format: string = buffer.toString()
            let parts: string[] = format.split(/=(.+)/)
            let key: string = parts[0]
            let value: string = parts[1]
            data[key] = value
        } catch (_) {}
        // Return data a KeyValue
        return data
    }

    /**
     * Decode all buffer items to KeyValye
     * @param buffers
     * @returns
     */
    public decodeAll(buffers: Buffer[]) {
        return buffers
            .filter((i) => i.length > 1)
            .map((i) => this.decode(i))
            .reduce((prev, curr) => {
                const obj = prev
                let [key] = Object.keys(curr)
                let [value] = Object.values(curr)
                obj[key] = value
                return obj
            }, {})
    }
}

export default DnsTxt
