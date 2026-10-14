"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrivateKeyOld = createPrivateKeyOld;
// ---------------------------------------------------------------------------------------------------------------------
// node-opcua-pki
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (c) 2014-2022 - Etienne Rossignon - etienne.rossignon (at) gadz.org
// Copyright (c) 2022-2025 - Sterfive.com
// ---------------------------------------------------------------------------------------------------------------------
//
// This  project is licensed under the terms of the MIT license.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so,  subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// ---------------------------------------------------------------------------------------------------------------------
const assert_1 = __importDefault(require("assert"));
const _env_1 = require("./_env");
const common_1 = require("../common");
const _create_random_file_1 = require("./_create_random_file");
const execute_openssl_1 = require("./execute_openssl");
const common2_1 = require("../common2");
const q = common_1.quote;
const n = common2_1.makePath;
/**
 * create a RSA PRIVATE KEY
 *
 */ function createPrivateKeyOld(privateKeyFilename, keyLength) {
    return __awaiter(this, void 0, void 0, function* () {
        // istanbul ignore next
        if ((0, _create_random_file_1.useRandFile)()) {
            (0, assert_1.default)((0, _env_1.hasEnv)("RANDFILE"));
        }
        (0, assert_1.default)([1024, 2048, 3072, 4096].indexOf(keyLength) >= 0);
        const randomFile = (0, _env_1.hasEnv)("RANDFILE") ? n((0, _env_1.getEnv)("RANDFILE")) : "random.rnd";
        yield (0, _create_random_file_1.createRandomFileIfNotExist)(randomFile, {}),
            // Note   OpenSSL1 generates a -----BEGIN RSA PRIVATE KEY---- whereas
            //        OpenSSL3 generates a -----BEGIN PRIVATE KEY----- unless the new -traditional option is used
            //
            // a BEGIN PRIVATE KEY structure is
            //
            // SEQUENCE (3 elem)
            //   INTEGER 0
            //   SEQUENCE (2 elem)
            //     OBJECT IDENTIFIER 1.2.840.113549.1.1.1 rsaEncryption (PKCS #1)
            //     NULL
            //   OCTET STRING (609 byte) 3082025D02010002818100C5B53231183906122A5E3778736B05C095C75F1BB80D48B
            //      SEQUENCE (9 elem)
            //
            // a BEGIN RSA PRIVATE KEY structure is just
            //   SEQUENCE (9 elem)
            //
            // ------------
            // SEQUENCE (3 elem)
            //   INTEGER 0
            //   SEQUENCE (2 elem)
            //     OBJECT IDENTIFIER 1.2.840.113549.1.1.1 rsaEncryption (PKCS #1)
            //     NULL
            //   OCTET STRING (610 byte) 3082025E02010002818100B2AA439E27C3BA098C2702AA3198EB84A7DCBD5EE89C960…
            //     SEQUENCE (9 elem)
            //       INTEGER 0
            //       INTEGER (1024 bit) 125462895859728341123584977638642589270771742121547332287445289226366…
            //       INTEGER 65537
            //       INTEGER (1023 bit) 774731515410736871832760190435666409081718972781314217974674368631736…
            //       INTEGER (512 bit) 1180764843612672431114081004978719388013129627283808550504107596576487…
            //       INTEGER (512 bit) 1062556160427859677755725246352892525259232894278841408942283814742302…
            //       INTEGER (512 bit) 8949288388532991287104785339472809167552401673320618630794823159001369…
            //       INTEGER (512 bit) 7748065421164683482653822084922773530923521184169484732585074266859925…
            //       INTEGER (512 bit) 1095294121686521689461230080512147243032904766384703204256065545245002…
            // SEQUENCE (3 elem)
            //   INTEGER 0
            //   SEQUENCE (2 elem)
            //     OBJECT IDENTIFIER 1.2.840.113549.1.1.1 rsaEncryption (PKCS #1)
            //     NULL
            //   OCTET STRING (1190 byte) 308204A202010002820101008D57525CF578A09A540144C58BC1E0A22014261C2756…
            //     SEQUENCE (9 elem)
            //       INTEGER 0
            //       INTEGER (2048 bit) 178426609506070188409882662408448396194020805872625675714062746989511…
            //       INTEGER 65537
            //       INTEGER (2046 bit) 479410740008299120757682500320485803222685257276205124379958025502892…
            //       INTEGER (1024 bit) 137695219737286994055132178347232356287024706246418361355523203552368…
            //       INTEGER (1024 bit) 129580830653740837008469816238439062404066917510657577819175199112208…
            //       INTEGER (1023 bit) 609718979626175834639964572018353446060920850095527846336769056729744…
            //       INTEGER (1022 bit) 376719039084139366697037613682496827133479863181189073376679596057938…
            //       INTEGER (1021 bit) 162921471472202227976749871246879611058257361785053516568268141902018…
            // */
            yield (0, execute_openssl_1.execute_openssl)("genrsa " + " -out " + q(n(privateKeyFilename)) + ((0, _create_random_file_1.useRandFile)() ? " -rand " + q(randomFile) : "") + " " + keyLength, {});
    });
}
//# sourceMappingURL=create_private_key.js.map