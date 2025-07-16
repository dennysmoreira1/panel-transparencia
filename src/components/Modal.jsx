const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl min-w-[300px] max-w-md">
            {children}
        </div>
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-xl"
        >
            ✕
        </button>
    </div>
);

export default Modal;
