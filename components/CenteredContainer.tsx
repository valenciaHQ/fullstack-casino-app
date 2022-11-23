import React from "react";

function CenteredContainer({ children }: { children: React.ReactNode }) {
    return <section className="flex flex-col h-screen w-100 justify-center items-center bg-slate-200 text-black">{children}</section>
}

export default CenteredContainer