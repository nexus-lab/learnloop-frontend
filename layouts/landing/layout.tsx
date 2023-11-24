export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-full w-full">
        {/* Left Column */}
        <div className="bg-main px-20" style={{width: '50%'}}>
          {children}
        </div>
  
        {/* Right Column */}
        <div className="bg-top" style={{width: '50%'}}>
          {/* Content for the right column goes here */}
          <p>wawda</p>
        </div>
      </div>
    );
  }
  