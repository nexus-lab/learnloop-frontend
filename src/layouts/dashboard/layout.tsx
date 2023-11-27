export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full" style={{backgroundColor: "#0F0F0F"}}>
        {children}
    </div>
  );
}
