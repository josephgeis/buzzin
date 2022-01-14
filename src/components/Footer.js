function Footer() {
  return (
    <div className="flex text-xs font-light absolute bottom-0 p-2 text-center gap-x-4 justify-center items-center">
      <p>
        by{" "}
        <a className="font-bold" href="https://josephgeis.dev/">
          Joseph&nbsp;Geis
        </a>
      </p>
      <p>
        Open Source on{" "}
        <a className="font-bold" href="https://github.com/josephgeis/buzzin">
          GitHub
        </a>
      </p>
      <p>
        <a className="font-bold" href="https://josephgeis.dev/legal">
          Privacy
        </a>
      </p>
    </div>
  );
}

export default Footer;
