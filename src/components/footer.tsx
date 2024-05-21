export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="flex md:text-base text-sm items-center justify-center w-full md:p-4 p-2 bg-black text-white">
      <h1>Sarasa Silva | @ {year} All Right Reserved.</h1>
    </footer>
  );
}
