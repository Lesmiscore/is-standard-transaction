// MIT License, by nao20010128nao
// ref. https://github.com/bitcoin/bitcoin/blob/bccb4d29a8080bf1ecda1fc235415a11d903a680/src/policy/policy.cpp
const bitcoin = require('bitcoinjs-lib');
const classify = require('bitcoinjs-lib/src/classify');

const Transaction = bitcoin.Transaction;


const defaultParams = Object.freeze({
    nulldataSize: 80,
    multisigMax: 3,
    nulldataCount: 1,
    maxWeight: 400000,
    scriptSigSize: 1650,
    dust: 0
});

const ILLEGAL_PARAM_OBJECT = "illegal-param-object";
const TX_SIZE = "tx-size";
const NONSTANDARD = "nonstandard";
const TOO_LARGE_NULLDATA = "too-large-nulldata";
const TOO_MANY_NULLDATA = "too-many-nulldata";
const MULTISIG_TOO_MANY_KEYS = "multisig-too-many-keys";
const MULTISIG_MINIMUM_INVERSED = "multisig-minimum-inversed";
const DUST = "dust";

const SCRIPTSIG_SIZE = "scriptsig-size";
const SCRIPTSIG_NOT_PUSHONLY = "scriptsig-not-pushonly";

// IsStandard, with reason
const isStandardScript = (buf, params) => {
    params = Object.assign({}, defaultParams, params);
    if (buf.length == 0)
        return true;
    const type = classify.output(buf);
    const decompiled = bitcoin.script.decompile(type);
    switch (type) {
        case classify.types.NULLDATA:
            const dataSize = decompiled[1].length;
            if (dataSize <= params.nulldataSize) {
                return true;
            } else {
                return TOO_LARGE_NULLDATA;
            }
            // Any of following cannot be ambiguous
        case classify.types.P2PK:
        case classify.types.P2PKH:
        case classify.types.P2SH:
        case classify.types.P2WPKH:
        case classify.types.P2WSH:
        case classify.types.WITNESS_COMMITMENT:
            return true;
        case classify.types.P2MS:
            // Think "<m> <A pubkey> [B pubkey] [C pubkey...] <n> OP_CHECKMULTISIG" on your brain
            const m = decompiled[0];
            const n = decompiled[decompiled.length - 2];
            if (n < 1 || n > params.multisigMax)
                return MULTISIG_TOO_MANY_KEYS;
            if (m < 1 || m > n)
                return MULTISIG_MINIMUM_INVERSED;
        case classify.types.NONSTANDARD:
        default:
            return NONSTANDARD;
    }
}

// IsStandardTx
const func = (tx, params) => {
    params = Object.assign({}, defaultParams, params);
    // Convert input param to Transaction object
    // Accepts Buffer, Transaction
    if (tx instanceof Buffer) {
        tx = Transaction.fromBuffer(tx);
    } else if (tx instanceof Transaction) {
        // pass
    } else {
        return ILLEGAL_PARAM_OBJECT;
    }
    // L91
    if (tx.weight() > params.maxWeight)
        return TX_SIZE;
    for (let txIn of tx.ins) {
        // L106
        if (txIn.script.length > params.scriptSigSize) {
            return SCRIPTSIG_SIZE;
        }
        // L110
        if (!bitcoin.script.isPushOnly(txIn.script)) {
            return SCRIPTSIG_NOT_PUSHONLY;
        }
    }
    let nulls = 0;
    for (let txOut of tx.outs) {
        // L119
        const issResult = isStandardScript(txOut.script, params);
        if (!(typeof issResult === "boolean" && issResult)) {
            // non-standard
            return issResult;
        }
        // L124
        if (classify.output(txOut.script) === classify.types.NULLDATA) {
            nulls++;
            // L129
        } else if (txOut.value < params.dust) {
            return DUST;
        }
    }
    // L136
    if (nulls > params.nulldataCount) {
        return TOO_MANY_NULLDATA;
    }

    // L141
    return true;
};

module.exports = Object.assign(func, {
    isStandardScript,
    errors: {
        OK: true,
        TX_SIZE,
        ILLEGAL_PARAM_OBJECT,
        NONSTANDARD,
        TOO_LARGE_NULLDATA,
        TOO_MANY_NULLDATA,
        MULTISIG_TOO_MANY_KEYS,
        MULTISIG_MINIMUM_INVERSED,
        DUST,
        SCRIPTSIG_SIZE,
        SCRIPTSIG_NOT_PUSHONLY
    }
});