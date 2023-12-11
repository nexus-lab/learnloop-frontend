import React from "react";

export const OutlineInput = ({ ...props }) => {
    return (
        React.createElement("input", Object.assign({
            className: "h-10 w-full text-sm px-2 rounded-sm bg-transparent border-[1px] border-divider focus:border-mainblue focus-visible:ring-0 focus:outline-none" 
        }, props))
    );
}
