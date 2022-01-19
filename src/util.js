const NULL_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
const DEFAULT_NONCE = 0;
const DEFAULT_DIFFICULTY = 6;

const NUM_ZEROS = {
    "0": 8,
    "1": 7,
    "2": 6,
    "3": 6,
    "4": 5,
    "5": 5,
    "6": 5,
    "7": 5,
    "8": 4,
    "9": 4,
    "a": 4,
    "b": 4,
    "c": 4,
    "d": 4,
    "e": 4,
    "f": 4,
};

async function sha256(x) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(x));
    const array = Array.from(new Uint8Array(buffer));
    return array;
}

async function hash(x) {
    const array = await sha256(x);
    const hex_string = array.map(bytes => bytes.toString(16).padStart(2, "0")).join("");
    return "0x" + hex_string;
}

function copy(array) {
    return array.map(x => ({ ...x }));
}

function validate(_xs) {
    let xs = copy(_xs);
    for (let i = 0; i < xs.length; i++) {
        if (i === 0) {
            xs[i].valid = true;
        } else {
            xs[i].valid = xs[i - 1].valid && xs[i].previousHash === xs[i - 1].hash;
        }
    }
    return xs;
}

async function mine(start, _xs) {
    let xs = copy(_xs);
    for (let i = start; i < xs.length; i++) {
        const previousHash = i === 0 ? NULL_HASH : xs[i - 1].hash;
        const contents = xs[i].contents;
        const nonce = String(xs[i].nonce);
        const blockValue = String(previousHash + contents + nonce);
        const hashValue = await hash(blockValue);
        xs[i].previousHash = previousHash;
        xs[i].hash = hashValue;
        xs[i].valid = true;
    }
    return xs;
}

async function proofOfWork(start, _xs, difficulty) {
    let xs = copy(_xs);
    for (let i = start; i < xs.length; i++) {
        const previousHash = i === 0 ? NULL_HASH : xs[i - 1].hash;
        const contents = xs[i].contents;
        let nonce = 0;
        while (true) {
            const array = await sha256(previousHash + contents + String(nonce));
            const hash = array.map(bytes => bytes.toString(16).padStart(2, "0")).join("");
            let num_zeros = 0;
            for (const c of hash) {
                num_zeros += NUM_ZEROS[c];
                if (c !== "0") {
                    break;
                }
            }
            if (num_zeros >= difficulty) {
                xs[i].previousHash = previousHash;
                xs[i].hash = "0x" + hash;
                xs[i].nonce = nonce;
                xs[i].valid = true;
                break;
            } else {
                nonce += 1;
            }
        }
    }
    return xs;
}

export { NULL_HASH, DEFAULT_NONCE, DEFAULT_DIFFICULTY, hash, validate, mine, proofOfWork };