import React from "react";
import {useState, useEffect} from "react";

const Footer: React.FC = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <>
            <div className="pt-lg-10 pt-5 footer bg-white">
                <p>{`© ${year}. All Rights Reserved.`}</p>
            </div>
        </>
    );
};

export default Footer;