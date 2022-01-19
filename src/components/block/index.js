const DISABLED_INPUT = x => `${x} col-span-2 cursor-not-allowed bg-gray-900 text-gray-100`;

function Block({ hash, previousHash, actualPreviousHash, contents, blockNumber, valid, nonce, last, onChange, mine, remove }) {
    const truncate = s => `${s.slice(0, 5)}..${s.slice(-3)}`;

    const id = prefix => `${prefix}_${String(blockNumber)}`;

    const error = previousHash !== actualPreviousHash;

    return (
        <div className={`grid grid-cols-3 grid-rows-9 gap-4 px-4 py-4 border border-white border-t-4 ${valid ? "border-t-green-500" : "border-t-red-500"}`}>
            <p className="block_header col-span-3 font-bold text-lg tracking-wide">Header</p>
            <label className="block_number col-span-1" htmlFor={id("block_number")}>Block number:</label>
            <input className={DISABLED_INPUT("block_number") + " text-right"} type="text" id={id("block_number")} value={String(blockNumber)} disabled />
            <label className="block_previous col-span-1" htmlFor={id("block_previous")}>Previous hash:</label>
            <input className={DISABLED_INPUT("block_previous") + " text-ellipsis"} type="text" id={id("block_previous")} value={previousHash} disabled />
            <label className="block_nonce col-span-1" htmlFor={id("block_nonce")}>Nonce:</label>
            <input className={DISABLED_INPUT("block_nonce") + " text-right"} type="text" id={id("block_nonce")} value={String(nonce)} disabled />
            <p className="block_body col-span-3 font-bold text-lg tracking-wide">Body</p>
            <label className="block_data col-span-1" htmlFor={id("block_data")}>Data:</label>
            <textarea
                className="block_data col-span-2 border border-white text-white bg-gray-900 caret-white resize-none" 
                id={id("block_data")} 
                value={contents} 
                onChange={e => onChange(e.target.value)} />
            <label className="block_hash col-span-1" htmlFor={id("block_hash")}>Hash:</label>
            <input className={DISABLED_INPUT("block_hash") + " text-ellipsis"} type="text" id={id("block_hash")} value={hash} disabled />
            <p className="block_errors col-span-3 text-center text-red-500 text-sm font-semibold">
                {error && `Previous hash ${truncate(actualPreviousHash)} does not match ${truncate(previousHash)}`}
            </p>
            {last 
                ? <button onClick={remove} className="col-start-1 col-end-2 font-semibold py-2 px-4 border border-gray-400 hover:border-red-600 text-gray-400 hover:text-red-600">Delete</button>
                : <div className="col-start-1 col-end-2 py-2 px-4"></div>
            }
            {error && <button onClick={mine} className="col-start-3 col-end-4 font-semibold py-2 px-4 border border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-gray-900">Mine</button>}
        </div>
    );
}

export default Block;