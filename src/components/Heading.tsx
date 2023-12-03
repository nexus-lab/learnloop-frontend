import React from "react";

export const Heading = ({ children, ...props } : {children: React.ReactNode}) => {
    return (React.createElement("h1", Object.assign({ className: "text-xl font-bold text-white" }, props), children));
}