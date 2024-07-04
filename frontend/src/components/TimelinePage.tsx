import React from "react";
import {useWindowSize} from "../hooks/useWindowSize.tsx";
import {Box} from "@mui/material";
import {Chrono} from "react-chrono";

const data = [
    {
        title: "2023年8月",
        cardTitle: "M3 inc.",
        cardSubtitle: "インターンシップ",
        cardDetailedText: "データサイエンティストとしてプロダクトのROI可視化に取り組みました。",
    },
    {
        title: "2023年11月",
        cardTitle: "Japan useware system Co.,Ltd.",
        cardSubtitle: "アルバイト",
        cardDetailedText:
            "ソフトウェアエンジニアとしてwebアプリケーションの開発を行っています。フロントエンド、バックエンド、テスト全てを一気通貫で開発しています。",
    },
    {
        title: "2024年2月",
        cardTitle: "(株)日立製作所",
        cardSubtitle: "インターン",
        cardDetailedText:
            "クラウドデータストレージシステムに関する研究開発を行いました。今までで最も大きな組織の中での研究であり様々なバックグランドを持つ人が揃っていたため、技術的知見を非常に深めることが出来ました。"
    },
];


const TimelinePage: React.FC = () => {
    const [width, height] = useWindowSize();
    return (
        <Box sx={{
            margin: 'auto',
            width: width * 0.8,
            maxWidth: '1000px',
            height: height,
            display: 'flex',
            flexDirection: 'column',
            alignItem: 'center'
        }}>
            <Chrono items={data} disableToolbar={true} mode="VERTICAL_ALTERNATING"/>
        </Box>
    );
}
export default TimelinePage;