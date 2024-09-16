export const WalletButton = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out"
    >
     {children}
    </button>
  );