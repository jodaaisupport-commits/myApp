export const metadata = {
  title: 'AI Studio',
  description: 'Interactive AI Studio for building, training, and experimenting with AI models.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-slate-950 text-slate-50 antialiased">{children}</body>
    </html>
  );
}
