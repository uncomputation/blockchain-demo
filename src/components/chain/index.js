import { hash as sha256, mine, NULL_HASH, proofOfWork, DEFAULT_DIFFICULTY } from "../../util";
import Block from "../block";

const Chain = ({ state, dispatch}) => {
    async function doWork(start, xs) {
        if (state.useProofOfWork) {
            return await proofOfWork(start, xs, DEFAULT_DIFFICULTY);
        }
        return await mine(start, xs);
    }

    async function add() {
        const newBlocks = await doWork(state.blocks.length, [...state.blocks, { contents: "You can edit this freely" }]);
        dispatch({
            type: "replace",
            payload: {
                newBlocks,
            }
        });
    }

    function remove() {
        dispatch({
            type: "delete"
        });
    }

    async function edit(blockNumber, newContents) {
        const previousHash = state.blocks[blockNumber].previousHash;
        const nonce = state.blocks[blockNumber].nonce;
        const blockValue = String(previousHash + newContents + String(nonce));
        const newHash = await sha256(blockValue);
        dispatch({
            type: "edit",
            payload: {
                blockNumber,
                contents: newContents,
                hash: newHash,
            }
        });
    }

    async function remine(blockNumber) {
        const newBlocks = await doWork(blockNumber, state.blocks);
        dispatch({
            type: "replace",
            payload: {
                newBlocks,
            }
        });
    }

    const blockComponents = state.blocks.map(
        ({ contents, hash, previousHash, nonce, valid }, blockNumber) =>
            <Block
                key={blockNumber}
                blockNumber={blockNumber}
                contents={contents}
                hash={hash}
                nonce={nonce}
                previousHash={previousHash}
                actualPreviousHash={blockNumber > 0 ? state.blocks[blockNumber - 1].hash : NULL_HASH}
                last={blockNumber === state.blocks.length - 1 ? true : false}
                remove={blockNumber === state.blocks.length - 1 ? remove : () => {}}
                valid={valid}
                mine={() => remine(blockNumber)}
                onChange={contents => edit(blockNumber, contents)} />);

    return (
        <div className="px-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {blockComponents}
            <div className="flex flex-row justify-center items-center">
                <button onClick={add} className="flex flex-row px-6 py-2 text-white border border-white hover:text-gray-900 hover:bg-white font-semibold">Add block</button>
            </div>
        </div>
    );
}

export default Chain;