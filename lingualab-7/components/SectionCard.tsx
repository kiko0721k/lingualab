import Link from "next/link";
export default function SectionCard(p:{icon:string;title:string;description:string;href:string;tags:string[]}){return <Link href={p.href} className="card feature"><div className="icon">{p.icon}</div><h3>{p.title}</h3><p className="muted">{p.description}</p><div className="chips">{p.tags.map(x=><span className="chip" key={x}>{x}</span>)}</div></Link>}
