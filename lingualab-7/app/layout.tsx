import "./globals.css";import Nav from "@/components/Nav";
export const metadata={title:"LinguaLab — 英语专业学习平台",description:"英语专业学生的听力、阅读、口语与词汇学习平台"};
export default function RootLayout({children}:{children:React.ReactNode}){return <><Nav/><main>{children}</main><footer className="footer"><div className="shell">LinguaLab 7.0 · English-major learning workspace</div></footer></>}
