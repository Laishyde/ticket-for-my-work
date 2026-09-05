export default function Html({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" style={{ height: "100%" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <style>{`
          html, body, #root {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          #root {
            display: flex;
            flex: 1;
          }
          body {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}</style>
      </head>
      <body style={{ margin: 0, height: "100%" }}>{children}</body>
    </html>
  );
}
