const Control = ({ pow, togglePow }) => {
    return (
        <div className="flex flex-row justify-end py-4 px-4">
            <div className="flex flex-col justify-start items-end">
                <label>
                    <input type="checkbox" id="enable_pow" checked={pow} onChange={togglePow} /> Enable proof of work
                </label>
                <p>{pow ? "Warning: Enabling proof of work can slow down your computer." : " "}</p>
            </div>
        </div>
    );
}

export default Control;