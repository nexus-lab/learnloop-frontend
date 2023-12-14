import React from "react";

// export const OutlineInput = ({ ...props }) => {
//     return (
//         React.createElement("input", Object.assign({
//             className: "h-10 w-full text-sm px-2 rounded-sm bg-transparent border-[1px] border-divider focus:border-mainblue focus-visible:ring-0 focus:outline-none"
//         }, props))
//     );
// }

export const OutlineInput = ({
  height = "h-10",
  width = "w-full",
  align = "text-left",
  ...props
}) => {
  const inputClass = `${height} ${width} ${align} text-sm px-2 rounded-sm bg-transparent border-[1px] border-divider focus:border-mainblue focus-visible:ring-0 focus:outline-none`;

  return React.createElement("input", { ...props, className: inputClass });
};
