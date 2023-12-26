import React, { useState } from "react";

export const OutlineInputFile = ({ onFileSelect, ...props }) => {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : '');

        // Call the callback function with the selected file
        if (onFileSelect) {
            onFileSelect(file);
        }
    };

    return (
        <div className="flex items-center">
            <label 
                htmlFor="file-upload" 
                className="px-2 py-2 text-sm rounded-sm bg-transparent border-[1px] border-divider focus-within:border-mainblue cursor-pointer"
            >
                Choose a file
                <input 
                    id="file-upload"
                    type="file" 
                    className="hidden"
                    onChange={handleFileChange}
                    {...props} 
                />
            </label>
            {fileName && <span className="ml-2 text-sm">{fileName}</span>}
        </div>
    );
}
