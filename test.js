const index = require('./');
const assert = require('assert');
const bitcoin = require('bitcoinjs-lib');

const txHash = tx =>
    bitcoin.Transaction.fromHex(tx).getId();

describe('it should detect transactions as expected', function () {
    const fixtures = [
        // https://insight.bitpay.com/tx/9edfb59c70d078f6b377a8c86dd36d60dedc005fa67e51798611619946b9e3bc
        {
            tx: "010000000250c70a1f02779d3412b2f51408c5bd58c6585f983a869dff813348e73a0ed9cd0000000023220020bcf9f822194145acea0f3235f4107b5bf1a91b6b9f8489f63bf79ec29b360913ffffffff2cd948465ff64bb1a1e6d97d72c6520794742668aeae450c7b69c66e2fa4ebb15d0000006a47304402200f54b22cc01108270ba4847528d775af95ebce3bf62cd1f649caf34e6814e828022062a736cd67baaf3e98f8ec82269a2ee763aafe81f85fa350172d8fa1c7c27ece0121038be2bb4a60f826c1175ea14cc4f462df0147a447f9dfbc318974ce5e625fe5dcffffffff02831f20000000000017a91430897cc6c9d69f6a2c2f1c651d51f22219f1a4f6871a7868000000000017a91469f373f2ecf10c964c68d1dbfcc2d5916f50f0a687000000000",
            expected: true,
            params: {}
        },
        // original transaction by me that is not standard (without prevOutScript)
        {
            name: "original transaction by me that is not standard (without prevOutScript)",
            tx: "0100000001567ecbd2270b17285c28ec5fdcf4260a3c635308bb9f9d4e2fdfe22a11eff3510000000000ffffffff01b8fa651e0000000016001452269206ddc8e3d8ebfd9f14ddf0b260b540966900000000",
            expected: true,
            params: {}
        },
        // original transaction by me that is not standard (with prevOutScript)
        {
            name: "original transaction by me that is not standard (with prevOutScript)",
            tx: "0100000001567ecbd2270b17285c28ec5fdcf4260a3c635308bb9f9d4e2fdfe22a11eff3510000000000ffffffff01b8fa651e0000000016001452269206ddc8e3d8ebfd9f14ddf0b260b540966900000000",
            expected: "nonstandard",
            params: {
                prevOutScript: [
                    bitcoin.address.toOutputScript("39eBWHgkZZogSU5LtmpzjoLNAw8vi44zoY")
                ]
            }
        },
        // https://mona.insight.monaco-ex.org/insight/tx/d361090d59f020f02c06fb1d7b128a8d6ae0ec1aaf1f2295acaedb5dc99872c9
        {
            tx: "0100000000010b4d068652458480d46cf4a2328f2c26a485e7ef9cec85e50eae595e20898653fc010000001716001445692004c44f19f063ed33acdf86c9de10e8dee8ffffffff5e5eef61d4234495fc639406a609da6776bc9c8dfcf32f9f98e5c2a374351dc10000000000ffffffff28630395803de6062ee626115ad0317736502af8cfe69050babcb4222bd937e40000000000ffffffff7c7b8705f0bd36323fd453aa660b308fb4bafe98f6414c97995781779f80aa18010000001716001431d1ff02fab016bcb308f31c557a4dd8f16ba249ffffffff3a40dcc3ae6acf7b64c18790d815f8e2f242c03bf4aeae0dbeea5b2e42ed07af0000000017160014ae871134b2879f4326d87cce992e9396b5ca709dffffffffbe3a30c74ded4c536f20c2c4f25aafa5bfb136435a85b2a74a52225cf96bfaab0100000017160014ae871134b2879f4326d87cce992e9396b5ca709dffffffff14d5d808bc3846ff26064192463029d8b5ae9c393cd46ba264fbdaa35dac203a0000000000ffffffff0c0d51a5ad3334a6afc9f477d31bf07c006338a1ddd80dfc0112c3cf700817590000000017160014ae871134b2879f4326d87cce992e9396b5ca709dfffffffffcafda94bd1d5ca709a452b6e65644f78c343f4d9c83ea2e07301fce50ce8c210000000000ffffffffb814db23ea6d5d7dd847bfe207e08f74f2b8e1e59ea2db5dee99e30c877fc0a601000000171600148bea0a174fd34090fb0fec893f434b1c1f215d8fffffffff30730f4e98cce3ce1fbfc2180fe98f1cb812230d5b67e722002bf99568072633000000006a4730440220543a0dff68d4e4966ce834de824142aa9895a670734eefeea5048dbc9a815937022072a800a5a5190321d6f7dc34357516bede062d2974039a27d332cdbed67f9d74012102d8c78cfcf2f6dcfbacd3c95879f5e6b62859a0e979aabd6801085739d0c6b079ffffffff017d7205fe03000000160014e9bb286a3028bd47598fb4432a1d26d78a5bee6c02483045022100c67f694cf9567e8b1bb50c9267d1761ba2ede3187c21506dc2b47dd5b9685cdf022079714ce644b4a224e2263252f3652aa348597d2fd0a67cccbbf1a2483a9746b60121027412b3b20b737f83693138c8b0ee9e2a25f45e19da0f146a27c1014cbd5ecfc902483045022100ba050cbcbfef865d30606c8bcba4d7cb3b1e9a91d959ce3c569ecf6521aeadda022027965dc303d9e24f2386425e07dff5417b32e3ace2435f50bd4fc157df3cdce30121033045bce9338ae52fea5e2368f3df1f5d969af3c27f7e85b778e4abc596d7c32f0247304402201bb8785b81a6b24a9e5d213a4c239ef79a1433a6090121d5c8259e442ef3c8290220269ee698d6ac61f376cc1afbed6c5a6aacbdc460d08e9b3790277591ceca6efa0121037bbb8bbecdcbb8e6f1caf954f1e9992c1e2af842af172f9ff392261601708286024730440220565536fd0d352ff8d13b558a1df475754eb770fcfc1147c7eeb48ce6fcaad807022008f4609d33bad00bdc5780e7a00a73269340db281da30307e65d2202524a1cb8012103b53f83ca023c06b790799ed1b54315ccb61d44f33d62c79dd91062203069e18102483045022100b3e581278027a1335867eb5937bb841c96fdcf5d664174b9dab1bd93241726c5022066cf832620f7c9cf8bee1ea60aae1ab7fa22210b8cd3a1ba096d12162699cd62012102679fbbd23e79f23c27535cc3a1f0d174030f4f369ccf71250351dbf30a9b136902483045022100dab1861ba9bf360a90e0036e5277956f90449a69850d7b3349270340066fb3e20220578cc980a1c172542aeecef1f92e0b4edf5dfdf2ddfe1e25a8e01092c13a389e012102679fbbd23e79f23c27535cc3a1f0d174030f4f369ccf71250351dbf30a9b13690247304402200e1acbd32a09cc12fe2c2fe2e7933de0961b6d7b8292c7c3e0d14a765984002a0220308e269d00af353930dc65b721364886607da43bff4fc62998ed3fc0d31c9c39012102842534b7772a4859e818fbc3cc763d24fb41bf6912abfea88188f1951b0c9f69024730440220144badd41bea618dc31a28236ac4050c77fa57ce1d6d498abbf0c606222c94fb0220147be3d738e2a4dc0c00950a086f3b7b9cae40c65a38ebf7015b02ad2d7ab576012102679fbbd23e79f23c27535cc3a1f0d174030f4f369ccf71250351dbf30a9b13690247304402201cd6a4bb081c1d0fcafbf56a763266bd507a53d562f0cbc46728b7f0a0af2621022061508389a31a66735b098f58cd41b6dfeee2e775118ab3b81b90e58343790abb0121026e389e438352316e9a120c5f30e9968701fc71b2e079d22e185459477dd4468202483045022100ea8f7d29dfe946287833decbe30bf968a11d7c2a9660719ffb6a2c001238ccd6022057144a1ff3810a87802b701fb3eb5592b40f2fb5fa103c559c62691d08b6288b01210380724d29216022682d96fdf54cd63fba529bc1f4c134acde1527ebeeebe405570000000000",
            expected: true,
            params: {}
        }
    ];

    for (let elem of fixtures) {
        it(elem.name || `${txHash(elem.tx)}`, function () {
            assert.strictEqual(index(elem.tx, elem.params), elem.expected);
        });
    }
});