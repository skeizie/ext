import React from "react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white p-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-brand-accent">404</h1>
        <p className="text-2xl font-bold mt-4">Page not found</p>
        <p className="text-muted-foreground mt-2 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="px-8 py-4 bg-brand-accent rounded-xl font-bold">Back to Site</a>
      </div>
    </div>
  );
}

export default NotFound;
