/**
 * |           |                                                            |
 * |-----------|------------------------------------------------------------|
 * | namespace |http://opcfoundation.org/UA/                                |
 * | nodeClass |DataType                                                    |
 * | name      |InterfaceAdminStatus                                        |
 * | isAbstract|false                                                       |
 */
export declare enum EnumInterfaceAdminStatus {
    /**
     * Ready to pass packets.
     */
    Up = 0,
    /**
     * Not ready to pass packets and not in some test
     * mode.
     */
    Down = 1,
    /**
     * In some test mode.
     */
    Testing = 2
}
