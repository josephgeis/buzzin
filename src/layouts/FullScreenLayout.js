import Footer from "../components/Footer";

function FullScreenLayout({ className, children }) {
  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-y-2">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default FullScreenLayout;
