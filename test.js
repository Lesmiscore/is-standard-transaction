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
        // original transaction by me that is not standard
        {
            tx: "0100000001567ecbd2270b17285c28ec5fdcf4260a3c635308bb9f9d4e2fdfe22a11eff3510000000000ffffffff01b8fa651e0000000016001452269206ddc8e3d8ebfd9f14ddf0b260b540966900000000",
            expected: "nonstandard",
            params: {}
        }
    ];

    for (let elem of fixtures) {
        it(`${txHash(elem.tx)}`, function () {
            assert.strictEqual(index(elem.tx, elem.params), elem.expected);
        });
    }
});