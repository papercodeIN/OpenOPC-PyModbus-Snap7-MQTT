| Group                        | Type ID   | Description                                       | Data Type                                     | Example Value                             |
|------------------------------|-----------|---------------------------------------------------|-----------------------------------------------|-------------------------------------------|
| Single-Point   Information   | M_SP_NA_1 | Single-point information without   time tag       | Binary (1 bit)                                | 0 or 1                                    |
|                              | M_SP_TA_1 | Single-point information with   time tag          | Binary (1 bit) + Timestamp                    | 1, Timestamp: 2024-08-29   12:00:00       |
| Double-Point   Information   | M_DP_NA_1 | Double-point information without   time tag       | Double-bit binary (2 bits)                    | 0, 1, 2, or 3                             |
|                              | M_DP_TA_1 | Double-point information with   time tag          | Double-bit binary (2 bits) +   Timestamp      | 2, Timestamp: 2024-08-29   12:00:00       |
| Step   Position Information  | M_ST_NA_1 | Step position information   without time tag      | Integer (16-bit signed)                       | -32768 to 32767                           |
|                              | M_ST_TA_1 | Step position information with   time tag         | Integer (16-bit signed) +   Timestamp         | -12000, Timestamp: 2024-08-29   12:00:00  |
| Measured Values              | M_ME_NA_1 | Measured value, normalized   without time tag     | Normalized (scaled to -1 to +1)               | 0.75                                      |
|                              | M_ME_NB_1 | Measured value, scaled without   time tag         | Scaled (16-bit integer)                       | 1234                                      |
|                              | M_ME_NC_1 | Measured value, floating point   without time tag | Floating-point (32-bit)                       | 12.34                                     |
|                              | M_ME_TA_1 | Measured value, normalized with   time tag        | Normalized (scaled to -1 to +1)   + Timestamp | 0.95, Timestamp: 2024-08-29   12:00:00    |
|                              | M_ME_TB_1 | Measured value, scaled with time   tag            | Scaled (16-bit integer) +   Timestamp         | 789, Timestamp: 2024-08-29   12:00:00     |
|                              | M_ME_TC_1 | Measured value, floating point   with time tag    | Floating-point (32-bit) +   Timestamp         | 99.99, Timestamp: 2024-08-29   12:00:00   |
| Integrated   Totals          | M_IT_NA_1 | Integrated totals without time   tag              | Integer (32-bit unsigned)                     | 12345678                                  |
|                              | M_IT_TA_1 | Integrated totals with time tag                   | Integer (32-bit unsigned) +   Timestamp       | 9876543, Timestamp: 2024-08-29   12:00:00 |
| Binary   Counter Information | M_BO_NA_1 | Binary counter reading without   time tag         | 32-bit binary number                          | 4294967295                                |
| Single   Commands            | C_SC_NA_1 | Single command                                    | Single bit command                            | 0 or 1                                    |
| Double   Commands            | C_DC_NA_1 | Double command                                    | Double bit command                            | 0, 1, 2, or 3                             |
| Regulating   Step Commands   | C_RC_NA_1 | Regulating step command                           | Single byte (8-bit unsigned)                  | 0 to 255                                  |
| Set   Points                 | C_SE_NA_1 | Set point command, normalized                     | Normalized value (scaled to -1   to +1)       | -0.5                                      |
|                              | C_SE_NB_1 | Set point command, scaled                         | Scaled value (16-bit integer)                 | 1500                                      |
|                              | C_SE_NC_1 | Set point command, short   floating point         | Floating-point (32-bit)                       | 45.6                                      |
| Bitstring                    | M_BO_NA_1 | Bitstring of 32 bits                              | Bitstring (32 bits)                           | 1.01011E+31                               |
| File   Transfer              | F_FR_NA_1 | File ready                                        | File handling control commands                | "Start File Transfer"                     |
|                              | F_SR_NA_1 | Section ready                                     |                                               | "Section 1 Ready"                         |
