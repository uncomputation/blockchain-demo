import { useReducer } from "react";
import { NULL_HASH, DEFAULT_NONCE, validate } from "./util";
import Chain from './components/chain';
import Control from './components/control';
import Header from "./components/header";
import Footer from "./components/footer";

const INITIAL_BLOCKS = [
  { contents: "Hello world", hash: "0x1d233028054dacf6fad036868cce47fd85817ffab244fdc738331f43c433f6ac", nonce: DEFAULT_NONCE },
  { contents: "This is a blockchain", hash: "0x5de6f4d9156151d03bd425a74a85bc2a790bd43fb3c8a112e36f42762288abb1", nonce: DEFAULT_NONCE },
  { contents: "It is an immutable ledger", hash: "0xeb1feeb8d1bdd7779d724e3bbaa315a4f89bc9f7d103db15d8dd28e977d46919", nonce: DEFAULT_NONCE },
  { contents: "Any change invalidates all future blocks", hash: "0x178b40bf4a1bec9b7678787629299b634fa27c6e668e73b98bc5e016d3cc88fc", nonce: DEFAULT_NONCE },
  { contents: "Try changing the text of any block yourself", hash: "0x639be3e6ee66a4f845a28a17f3e51fe5a4a3d95e4d444362a45695ff434929ee", nonce: DEFAULT_NONCE },
].map((block, i, blocks) => i === 0
  ? { ...block, valid: true, previousHash: NULL_HASH }
  : { ...block, valid: true, previousHash: blocks[i - 1].hash }
);

const INITIAL_STATE = { blocks: validate(INITIAL_BLOCKS), useProofOfWork: false };

function REDUCER(state, action) {
  let blocks = state.blocks;
  switch (action.type) {
      case "delete":{
          return { ...state, blocks: blocks.slice(0, blocks.length - 1) };
      }
      case "edit": {
          const blockNumber = action.payload.blockNumber;
          const newBlock = {
              contents: action.payload.contents,
              hash: action.payload.hash,
              previousHash: blocks[blockNumber].previousHash,
              nonce: blocks[blockNumber].nonce,
          };
          const newBlocks = [...blocks];
          newBlocks[blockNumber] = newBlock;
          const validatedBlocks = validate(newBlocks);
          return { ...state, blocks: validatedBlocks };
      }
      case "replace": {
          return { ...state, blocks: action.payload.newBlocks };
      }
      case "pow-toggle": {
        return { ...state, useProofOfWork: !state.useProofOfWork }
      }
      default:
        return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(REDUCER, INITIAL_STATE);

  const togglePow = () => {
    dispatch({
      type: "pow-toggle"
    });
  };

  return (
    <div className="p-0 m-0 font-serif bg-gray-900 text-white">
      <Header />
      <Control pow={state.useProofOfWork} togglePow={togglePow} />
      <Chain state={state} dispatch={dispatch} />
      <Footer />
    </div>
  );
}

export default App;
