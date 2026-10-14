import { UAFolder, UAFolder_Base } from "./ua_folder";
import { UACertificateGroup } from "./ua_certificate_group";
/**
 * |                |                                                            |
 * |----------------|------------------------------------------------------------|
 * |namespace       |http://opcfoundation.org/UA/                                |
 * |nodeClass       |ObjectType                                                  |
 * |typedDefinition |CertificateGroupFolderType i=13813                          |
 * |isAbstract      |false                                                       |
 */
export interface UACertificateGroupFolder_Base extends UAFolder_Base {
    defaultApplicationGroup: UACertificateGroup;
    defaultHttpsGroup?: UACertificateGroup;
    defaultUserTokenGroup?: UACertificateGroup;
}
export interface UACertificateGroupFolder extends UAFolder, UACertificateGroupFolder_Base {
}
