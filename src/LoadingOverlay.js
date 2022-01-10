function LoadingOverlay({ message } = { message: null }) {
  return (
    <div className="loading-overlay">
      <div className="animate-spin">:</div>
      <p>{message || "Please wait..."}</p>
    </div>
  );
}

export default LoadingOverlay;
