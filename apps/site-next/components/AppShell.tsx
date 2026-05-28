import { Sidebar } from "./Sidebar";

export function AppShell({ children, text }: { children: React.ReactNode; text: any }) {
  return (
    <div className="container extended">
      <div className="main-container flex">
        <Sidebar text={text} />
        <main className="main full-width">{children}</main>
      </div>
    </div>
  );
}
