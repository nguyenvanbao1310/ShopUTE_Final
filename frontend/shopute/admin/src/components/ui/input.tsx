import React from "react";

export const Input = ({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={`border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500 ${
        props.className || ""
      }`}
    />
  );
};
