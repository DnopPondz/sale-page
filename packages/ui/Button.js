export default function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 rounded-2xl bg-primary text-white disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
