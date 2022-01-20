import logo from "./logo.svg";

const Header = () => {
    return (
        <header className="flex flex-row justify-start items-center py-4 px-14">
            <img className="h-8" src={logo} alt="Square with one blue arrow pointing backwards and another green arrow pointing forwards." />
            <h1 className="text-2xl font-semibold pl-4 tracking-wide">Blockchain Demo</h1>
        </header>
    )
};

export default Header;