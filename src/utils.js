import { useEffect } from "react";

function formatPin(pin = "") {
  switch (pin.length) {
    case 6:
      return `${pin.substr(0, 3)} ${pin.substr(3, 3)}`;
    case 7:
      return `${pin.substr(0, 3)} ${pin.substr(3, 4)}`;
    case 8:
      return `${pin.substr(0, 2)} ${pin.substr(2, 4)} ${pin.substr(6, 2)}`;
    default:
      return pin;
  }
}

export { formatPin };

function useTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export { useTitle };
