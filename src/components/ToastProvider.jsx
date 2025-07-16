import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ToastCtx = createContext();
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const push = (msg, type = "success") =>
        setToasts((t) => [...t, { id: Date.now(), msg, type }]);

    const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

    return (
        <ToastCtx.Provider value={{ push }}>
            {children}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            onClick={() => remove(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-2xl shadow-xl cursor-pointer ${t.type === "error" ? "bg-red-50" : "bg-green-50"
                                }`}
                        >
                            {t.type === "error" ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            <span className="text-sm">{t.msg}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastCtx.Provider>
    );
}
