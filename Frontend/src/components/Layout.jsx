import { ShieldCheck } from "lucide-react";

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <ShieldCheck size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Lending Decision System
                            </p>

                        </div>
                    </div>

                </div>
            </header>

            <main>{children}</main>
        </div>
    );
}

export default Layout;