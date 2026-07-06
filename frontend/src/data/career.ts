export interface TimelineItem {
    id: string;
    title: string;
    description: string;
    duration: string;
    status: string;
    projectTitle?: string;
    projectUrl?: string;
    tagList?: { id: string; name: string }[];
}

export const careerItems: TimelineItem[] = [
    {
        id: "1",
        title: "2023年8月",
        description: "データサイエンティストとしてプロダクトのROI可視化に取り組みました。データ分析に関する実務経験は初めてだったので良い経験となりました。一方で、これ以降分析基盤の方に興味を持つようになりました。",
        duration: "2週間",
        status: "インターン",
        projectTitle: "M3 inc.",
        tagList: [
            {id: "1", name: "SQL"},
            {id: "2", name: "BigQuery"},
        ],
    },
    {
        id: "2",
        title: "2023年11月",
        description:
            "ソフトウェアエンジニアとしてwebアプリケーションの開発を行っています。フロントエンド、バックエンド、テスト全てを一気通貫で開発しています。医療機関向けに薬品データベースの開発に取り組んでいます。",
        duration: "現在",
        status: "アルバイト",
        projectTitle: "Japan useware system Co.,Ltd.",
        tagList: [
            {id: "1", name: "React"},
            {id: "2", name: "SQLServer"},
            {id: "3", name: "Scala"},
        ],
    },
    {
        id: "3",
        title: "2024年2月",
        description:
            "クラウドデータストレージシステムに関する研究開発を行いました。今までで最も大きな組織の中での研究であり様々なバックグランドを持つ人が揃っていたため、技術的知見を非常に深めることが出来ました。",
        duration: "3週間",
        status: "インターン",
        projectTitle: "(株)日立製作所",
        tagList: [
            {id: "1", name: "AWS CDK"},
            {id: "2", name: "ShellScript"},
            {id: "3", name: "ネットワーク"}
        ],
    },
];
