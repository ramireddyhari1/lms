import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";
import { cookies } from "next/headers";
import { RoleProvider } from "@/components/RoleContext";

export const metadata: Metadata = {
  title: "Flippedlearn | Learner360°",
  description: "Empower. Educate. Employ.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if we are inside a protected route or login page by extracting the current user
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('currentUser')?.value
  const currentUser = userCookie ? JSON.parse(userCookie) : null

  // If no current user, we assume it's the login route (or they are bouncing to it)
  if (!currentUser) {
    return (
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>
        <body className="antialiased font-sans">
          {children}
        </body>
      </html>
    )
  }

  // Authenticated state renders the Dashboard Layout
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="antialiased font-sans">
        <RoleProvider user={currentUser}>
          <DashboardLayout currentUser={currentUser}>
            {children}
          </DashboardLayout>
        </RoleProvider>
      </body>
    </html>
  );
}
