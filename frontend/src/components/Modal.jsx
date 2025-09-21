function Modal({isOpen, onClose, title, children}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button className="text-black font-bold text-xl" onClick={onClose}>&times;</button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;