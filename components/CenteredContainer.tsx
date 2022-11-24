import React from "react";

function CenteredContainer({ children }: { children: React.ReactNode }) {
    return <section className="flex flex-col h-screen w-100 justify-center items-center text-black">{children}</section>
}

export default CenteredContainer